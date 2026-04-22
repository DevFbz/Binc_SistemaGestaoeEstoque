import { useEffect, useState } from 'react'
import { Save, RefreshCw, CheckCircle, XCircle } from 'lucide-react'
import Header from '../components/Header'
import api from '../api/client'
import toast from 'react-hot-toast'

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState<'empresa' | 'nota' | 'nfce' | 'cosmos'>('empresa')
  const [empresa, setEmpresa] = useState<any>(null)
  const [settings, setSettings] = useState<any>(null)
  const [nfce, setNfce] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [testingEan, setTestingEan] = useState(false)
  const [testEanResult, setTestEanResult] = useState<any>(null)

  useEffect(() => {
    api.get('/empresa').then(r => setEmpresa(r.data))
    api.get('/settings').then(r => setSettings(r.data))
    api.get('/nfce').then(r => setNfce(r.data))
  }, [])

  const E = (k: string, v: any) => setEmpresa((f: any) => ({ ...f, [k]: v }))
  const S = (k: string, v: any) => setSettings((f: any) => ({
    ...f, nota_fiscal: { ...f?.nota_fiscal, [k]: v }
  }))
  const SS = (k: string, v: any) => setSettings((f: any) => ({ ...f, [k]: v }))
  const N = (k: string, v: any) => setNfce((f: any) => ({ ...f, [k]: v }))

  const saveEmpresa = async () => {
    setSaving(true)
    try { await api.put('/empresa', empresa); toast.success('Dados da empresa salvos!') }
    catch { toast.error('Erro ao salvar') } finally { setSaving(false) }
  }

  const saveSettings = async () => {
    setSaving(true)
    try { await api.put('/settings', settings); toast.success('Configurações salvas!') }
    catch { toast.error('Erro ao salvar') } finally { setSaving(false) }
  }

  const saveNfce = async () => {
    setSaving(true)
    try { await api.put('/nfce', nfce); toast.success('NFC-e configurado!') }
    catch { toast.error('Erro ao salvar') } finally { setSaving(false) }
  }

  // Cosmos helpers
  const cosmosTokens: string[] = settings?.cosmos_tokens || ['', '', '', '', '']
  const cosmosCount: number = settings?.cosmos_usage_count || 0
  const validTokens = cosmosTokens.filter((t: string) => t && t.trim())
  const activeTokenIdx = validTokens.length > 0 ? Math.floor(cosmosCount / 25) % validTokens.length : -1

  const setCosmosToken = (idx: number, val: string) => {
    const tokens = [...cosmosTokens]
    while (tokens.length < 5) tokens.push('')
    tokens[idx] = val
    SS('cosmos_tokens', tokens)
  }

  const handleTestEan = async () => {
    setTestingEan(true)
    setTestEanResult(null)
    try {
      // Salva os tokens primeiro para garantir que o backend tem o token mais recente
      await api.put('/settings', settings)
      const res = await api.get('/cosmos/ean/7891910000197')
      setTestEanResult({ ok: true, data: res.data })
      toast.success('Conexão com Cosmos funcionando!')
    } catch (e: any) {
      const detail = e.response?.data?.detail || e.message || 'Erro desconhecido'
      const status = e.response?.status
      let hint = ''
      if (status === 400) hint = ' — Salve os tokens e tente novamente.'
      if (status === 401) hint = ' — Token inválido ou sem permissão.'
      if (status === 404) hint = ' — EAN não encontrado na base Cosmos (token OK).'
      if (status === 429) hint = ' — Limite de uso atingido para este token.'
      setTestEanResult({ ok: false, error: detail + hint })
      toast.error('Falha na conexão com Cosmos')
    } finally { setTestingEan(false) }
  }

  const tabs = [
    { id: 'empresa', label: '🏢 Empresa' },
    { id: 'nota', label: '🧾 Nota Fiscal' },
    { id: 'nfce', label: '📡 NFC-e' },
    { id: 'cosmos', label: '🔍 Cosmos EAN' },
  ]

  return (
    <div className="animate-fade-in">
      <Header title="Configurações" subtitle="Gerencie os dados do sistema e da empresa" />
      <div className="p-8 space-y-6 max-w-4xl">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t.id ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Empresa */}
        {tab === 'empresa' && empresa && (
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3">Dados da Empresa</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Razão Social</label>
                <input value={empresa.razao_social || ''} onChange={e => E('razao_social', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Nome Fantasia</label>
                <input value={empresa.nome_fantasia || ''} onChange={e => E('nome_fantasia', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">CNPJ</label>
                <input value={empresa.cnpj || ''} onChange={e => E('cnpj', e.target.value)} className="input font-mono" placeholder="00.000.000/0001-00" />
              </div>
              <div>
                <label className="label">IE</label>
                <input value={empresa.ie || ''} onChange={e => E('ie', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Regime Tributário</label>
                <select value={empresa.regime || '1'} onChange={e => E('regime', e.target.value)} className="select">
                  <option value="1">Simples Nacional</option>
                  <option value="2">Simples Nacional - Sublimite</option>
                  <option value="3">Regime Normal</option>
                </select>
              </div>
              <div>
                <label className="label">CNAE</label>
                <input value={empresa.cnae || ''} onChange={e => E('cnae', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Telefone</label>
                <input value={empresa.telefone || ''} onChange={e => E('telefone', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Email</label>
                <input value={empresa.email || ''} onChange={e => E('email', e.target.value)} className="input" type="email" />
              </div>
              <div className="col-span-2">
                <label className="label">Endereço</label>
                <input value={empresa.endereco || ''} onChange={e => E('endereco', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Bairro</label>
                <input value={empresa.bairro || ''} onChange={e => E('bairro', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Município</label>
                <input value={empresa.municipio || ''} onChange={e => E('municipio', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">UF</label>
                <input value={empresa.uf || ''} onChange={e => E('uf', e.target.value)} className="input" maxLength={2} />
              </div>
              <div>
                <label className="label">CEP</label>
                <input value={empresa.cep || ''} onChange={e => E('cep', e.target.value)} className="input" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={saveEmpresa} disabled={saving} className="btn-primary"><Save size={16} />{saving ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </div>
        )}

        {/* Nota Fiscal */}
        {tab === 'nota' && settings && (
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3">Configuração da Nota Fiscal / Cupom</h3>
            <div className="space-y-3">
              <div>
                <label className="label">Nome da Loja</label>
                <input value={settings?.nota_fiscal?.nome_loja || ''} onChange={e => S('nome_loja', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Slogan</label>
                <input value={settings?.nota_fiscal?.slogan || ''} onChange={e => S('slogan', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Endereço (na nota)</label>
                <input value={settings?.nota_fiscal?.endereco || ''} onChange={e => S('endereco', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Telefone (na nota)</label>
                <input value={settings?.nota_fiscal?.telefone || ''} onChange={e => S('telefone', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">CNPJ (na nota)</label>
                <input value={settings?.nota_fiscal?.cnpj || ''} onChange={e => S('cnpj', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Mensagem de rodapé</label>
                <textarea value={settings?.nota_fiscal?.rodape || ''} onChange={e => S('rodape', e.target.value)} className="input resize-none h-20" />
              </div>
              <div className="border-t border-gray-100 pt-4">
                <label className="label flex items-center gap-1">📱 Meu WhatsApp (para envio de notas)</label>
                <input value={settings?.meu_whatsapp || ''} onChange={e => SS('meu_whatsapp', e.target.value)} className="input" placeholder="5521999998888" />
                <p className="text-xs text-gray-400 mt-1">Formato: 55 + DDD + número</p>
              </div>
              <div>
                <label className="label flex items-center gap-1">⭐ Link Avaliação Google</label>
                <input value={settings?.google_review_link || ''} onChange={e => SS('google_review_link', e.target.value)} className="input" placeholder="https://g.page/r/xxxx/review" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={saveSettings} disabled={saving} className="btn-primary"><Save size={16} />{saving ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </div>
        )}

        {/* NFC-e */}
        {tab === 'nfce' && nfce && (
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3">Configuração NFC-e SEFAZ</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Série</label><input value={nfce.serie || ''} onChange={e => N('serie', e.target.value)} className="input font-mono" /></div>
              <div><label className="label">Próxima NF</label><input type="number" value={nfce.proxima_nf || 1} onChange={e => N('proxima_nf', parseInt(e.target.value) || 1)} className="input" /></div>
              <div>
                <label className="label">Ambiente</label>
                <select value={nfce.ambiente || '2'} onChange={e => N('ambiente', e.target.value)} className="select">
                  <option value="2">Homologação (teste)</option>
                  <option value="1">Produção</option>
                </select>
              </div>
              <div><label className="label">CUF (código UF)</label><input value={nfce.cuf || ''} onChange={e => N('cuf', e.target.value)} className="input font-mono" /></div>
              <div><label className="label">CSC ID</label><input value={nfce.csc_id || ''} onChange={e => N('csc_id', e.target.value)} className="input font-mono" /></div>
              <div><label className="label">CSC Token</label><input value={nfce.csc_token || ''} onChange={e => N('csc_token', e.target.value)} className="input font-mono text-xs" /></div>
              <div><label className="label">CMun</label><input value={nfce.cmun || ''} onChange={e => N('cmun', e.target.value)} className="input font-mono" /></div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={saveNfce} disabled={saving} className="btn-primary"><Save size={16} />{saving ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </div>
        )}

        {/* ─── COSMOS EAN ─── */}
        {tab === 'cosmos' && settings && (
          <div className="space-y-5">
            {/* Info Banner */}
            <div className="card p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">🔍</span>
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 text-base">Bluesoft Cosmos API</h3>
                  <p className="text-sm text-blue-700 mt-1">Consulta automática de produtos por código EAN/GTIN ao cadastrar um novo produto.</p>
                  <p className="text-xs text-blue-500 mt-1">Rotação automática: a cada <strong>25 cadastros via API</strong>, o sistema troca para o próximo token.</p>
                </div>
              </div>
            </div>

            {/* Tokens */}
            <div className="card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-800">Tokens de Acesso (até 5)</h4>
                <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-mono">
                  {cosmosCount} consultas realizadas
                </div>
              </div>

              {validTokens.length > 0 && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm">
                  <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-emerald-800">
                    Token ativo: <strong>Token {activeTokenIdx + 1}</strong>
                    {' '}— próxima troca em <strong>{25 - (cosmosCount % 25)} consulta(s)</strong>
                  </span>
                </div>
              )}

              <div className="space-y-3">
                {[0, 1, 2, 3, 4].map(i => {
                  const validList = cosmosTokens.filter((t: string) => t && t.trim())
                  const thisActive = validList.length > 0 && validList[activeTokenIdx] === cosmosTokens[i] && !!cosmosTokens[i]?.trim()
                  return (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${thisActive ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${thisActive ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {i + 1}
                      </div>
                      <input
                        value={cosmosTokens[i] || ''}
                        onChange={e => setCosmosToken(i, e.target.value)}
                        className={`input text-sm font-mono flex-1 ${thisActive ? 'border-emerald-300' : ''}`}
                        placeholder={`Token ${i + 1}`}
                      />
                      {cosmosTokens[i]?.trim() && (
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ${thisActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          {thisActive ? '● Ativo' : '○ Espera'}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
                💡 Token 1 → primeiros 25 cadastros via EAN | Token 2 → próximos 25 | e assim por diante.
              </p>
            </div>

            {/* Teste */}
            <div className="card p-5 space-y-3">
              <h4 className="font-bold text-gray-800">Testar Conexão</h4>
              <p className="text-sm text-gray-500">Consulta o EAN <code className="bg-gray-100 px-1 rounded font-mono text-xs">7891910000197</code> para verificar se a integração está funcionando.</p>
              <button onClick={handleTestEan} disabled={testingEan || validTokens.length === 0} className="btn-secondary flex items-center gap-2">
                <RefreshCw size={16} className={testingEan ? 'animate-spin' : ''} />
                {testingEan ? 'Testando...' : 'Testar Agora'}
              </button>
              {testEanResult && (
                <div className={`rounded-xl p-4 text-sm border ${testEanResult.ok ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  {testEanResult.ok ? (
                    <div className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-emerald-800">Conexão OK!</p>
                        <p className="text-emerald-700 text-xs mt-1">Produto: <strong>{testEanResult.data.name}</strong></p>
                        <p className="text-emerald-700 text-xs">Marca: {testEanResult.data.brand} | Categoria: {testEanResult.data.category}</p>
                        {testEanResult.data.image_url && <img src={testEanResult.data.image_url} alt="produto" className="mt-2 w-16 h-16 object-contain rounded border border-emerald-200" />}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-red-800">Falha na conexão</p>
                        <p className="text-red-700 text-xs mt-1">{testEanResult.error}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button onClick={saveSettings} disabled={saving} className="btn-primary"><Save size={16} />{saving ? 'Salvando...' : 'Salvar Tokens'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
