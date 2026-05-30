import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Product, ProductInsert } from '@/lib/supabase'
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  X,
  Save,
  Loader2,
  Tag,
  AlertCircle,
  Package,
  CheckCircle2,
  UploadCloud,
} from 'lucide-react'

// ─── Props ─────────────────────────────────────────────────────────────────────

interface AdminPanelProps {
  session: Session
}

// ─── Form empty state ──────────────────────────────────────────────────────────

const emptyForm = (): ProductInsert => ({
  name: '',
  description: '',
  price: 0,
  promotional_price: null,
  is_promoted: false,
  image_url: '',
})

// ─── Toast Notification ───────────────────────────────────────────────────────

interface ToastProps { message: string; type: 'success' | 'error' }

function Toast({ message, type }: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-2.5 px-4 py-3 rounded shadow-2xl text-sm font-medium ${
        type === 'success'
          ? 'bg-emerald-950 border border-emerald-700/40 text-emerald-300'
          : 'bg-red-950 border border-red-700/40 text-red-300'
      }`}
    >
      {type === 'success'
        ? <CheckCircle2 className="w-4 h-4" />
        : <AlertCircle className="w-4 h-4" />}
      {message}
    </motion.div>
  )
}

// ─── Product Form Modal ───────────────────────────────────────────────────────

interface ProductFormProps {
  initial?: Product
  onClose: () => void
  onSaved: () => void
}

function ProductForm({ initial, onClose, onSaved }: ProductFormProps) {
  const isEditing = !!initial
  const [form, setForm] = useState<ProductInsert>(
    initial
      ? {
          name: initial.name,
          description: initial.description ?? '',
          price: initial.price,
          promotional_price: initial.promotional_price,
          is_promoted: initial.is_promoted,
          image_url: initial.image_url ?? '',
        }
      : emptyForm()
  )
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initial?.image_url ?? null)
  
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: keyof ProductInsert, value: unknown) => {
    setForm((f) => ({ ...f, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || form.price <= 0) {
      setError('Nome e preço são obrigatórios.')
      return
    }
    setSaving(true)
    setError(null)

    let finalImageUrl = form.image_url

    // Se o usuário selecionou uma nova foto, fazemos upload
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        setError('Erro ao enviar imagem. Verifique se o bucket "products" foi criado no Supabase e está público.')
        setSaving(false)
        return
      }

      // Resgata a URL pública após o upload bem-sucedido
      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName)

      finalImageUrl = publicUrlData.publicUrl
    }

    const payload: ProductInsert = {
      ...form,
      promotional_price: form.promotional_price && form.promotional_price > 0
        ? form.promotional_price
        : null,
      image_url: finalImageUrl,
      description: form.description?.trim() || null,
    }

    const { error: dbError } = isEditing
      ? await supabase.from('products').update(payload).eq('id', initial!.id)
      : await supabase.from('products').insert(payload)

    if (dbError) {
      setError('Erro ao salvar. Verifique as credenciais do banco.')
      setSaving(false)
      return
    }

    onSaved()
    onClose()
  }

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-lg glass-panel rounded border border-couro-gold/15 p-6 z-10 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.96, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 16 }}
        transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.35 }}
        data-lenis-prevent
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-lg font-bold text-couro-ivory">
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </h3>
          <button onClick={onClose} className="text-couro-ivory/40 hover:text-couro-ivory transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="admin-label">Nome do Produto *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: Bolsa Elegance"
              className="admin-input"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="admin-label">Descrição</label>
            <textarea
              value={form.description ?? ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descrição editorial do produto..."
              rows={3}
              className="admin-input resize-none"
            />
          </div>

          {/* Preços */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Preço (R$) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price || ''}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="admin-input"
                required
              />
            </div>
            <div>
              <label className="admin-label">Preço Promocional (R$)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.promotional_price ?? ''}
                onChange={(e) =>
                  handleChange('promotional_price', e.target.value ? parseFloat(e.target.value) : null)
                }
                placeholder="0.00"
                className="admin-input"
              />
            </div>
          </div>

          {/* Toggle Promoção */}
          <div className="flex items-center justify-between p-3 border border-couro-gold/15 rounded bg-couro-black/30">
            <div>
              <p className="text-xs font-medium text-couro-ivory">Ativar Promoção</p>
              <p className="text-[10px] text-couro-ivory/40 mt-0.5">
                Exibe o preço promocional na vitrine
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.is_promoted}
              onClick={() => handleChange('is_promoted', !form.is_promoted)}
              className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                form.is_promoted ? 'bg-couro-gold' : 'bg-couro-ivory/15'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  form.is_promoted ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Image Upload */}
          <div>
            <label className="admin-label">Imagem do Produto</label>
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="admin-input flex flex-col items-center justify-center gap-2 border-dashed border-couro-gold/30 text-couro-ivory/50 group-hover:text-couro-gold group-hover:bg-couro-gold/5 transition-all py-6 bg-couro-black/30">
                <UploadCloud className="w-6 h-6 mb-1" />
                <span className="text-xs uppercase tracking-widest text-center px-4">
                  {imageFile ? imageFile.name : 'Clique ou arraste uma foto'}
                </span>
              </div>
            </div>
          </div>

          {/* Preview de imagem */}
          {imagePreview && (
            <div className="rounded overflow-hidden border border-couro-gold/15 aspect-video bg-couro-black/50 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-400/80 bg-red-950/20 border border-red-900/30 rounded px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <p className="text-xs">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-couro-gold/20 text-couro-ivory/50 hover:text-couro-ivory hover:border-couro-gold/40 py-2.5 rounded text-xs uppercase tracking-widest transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-couro-gold hover:bg-couro-caramel text-couro-black font-semibold py-2.5 rounded text-xs uppercase tracking-widest transition-colors disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {isEditing ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function AdminPanel({ session }: AdminPanelProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | undefined>()
  const [toast, setToast] = useState<ToastProps | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      showToast('Erro ao carregar produtos.', 'error')
    } else {
      setProducts(data as Product[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      showToast('Erro ao excluir produto.', 'error')
    } else {
      showToast('Produto excluído.', 'success')
      setDeleteConfirm(null)
      fetchProducts()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const openCreate = () => { setEditing(undefined); setFormOpen(true) }
  const openEdit = (p: Product) => { setEditing(p); setFormOpen(true) }
  const closeForm = () => { setFormOpen(false); setEditing(undefined) }
  const onSaved = () => { fetchProducts(); showToast('Produto salvo com sucesso!', 'success') }

  return (
    <div className="min-h-screen bg-couro-black text-couro-ivory font-sans">
      {/* Grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-couro-gold/10 bg-couro-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-serif tracking-[0.3em] text-base text-couro-ivory">COURO RICO</span>
            <span className="text-couro-gold/30">|</span>
            <span className="text-xs uppercase tracking-[0.2em] text-couro-ivory/40 font-mono">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-couro-ivory/30 hidden sm:block font-mono">
              {session.user.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-couro-ivory/40 hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="pt-24 pb-16 px-6 max-w-7xl mx-auto">

        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-couro-ivory">
              Catálogo de Produtos
            </h1>
            <p className="text-xs text-couro-ivory/35 font-mono mt-1">
              {products.length} produto{products.length !== 1 ? 's' : ''} cadastrado{products.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            id="admin-new-product-btn"
            onClick={openCreate}
            className="flex items-center gap-2 bg-couro-gold hover:bg-couro-caramel text-couro-black font-semibold text-xs uppercase tracking-widest px-4 py-2.5 rounded transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo Produto
          </button>
        </div>

        {/* ── Products Table ── */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <motion.div
              className="w-8 h-8 border-2 border-couro-gold/30 border-t-couro-gold rounded-full"
              animate={{ rotate: 360 }}
              transition={{ ease: 'linear', duration: 1, repeat: Infinity }}
            />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <Package className="w-12 h-12 text-couro-ivory/15 mx-auto mb-4" />
            <p className="font-serif text-lg text-couro-ivory/30 italic">Nenhum produto cadastrado.</p>
            <p className="text-xs text-couro-ivory/20 mt-1">
              Clique em "Novo Produto" para começar.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.35 }}
                  className="glass-panel rounded border border-couro-gold/10 hover:border-couro-gold/25 transition-colors"
                >
                  <div className="flex items-center gap-4 p-4">
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 border border-couro-gold/10 bg-couro-black/50">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-couro-ivory/15" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-serif font-semibold text-sm text-couro-ivory truncate">
                          {product.name}
                        </h3>
                        {product.is_promoted && (
                          <span className="inline-flex items-center gap-1 bg-couro-gold/15 border border-couro-gold/30 text-couro-gold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-mono font-medium flex-shrink-0">
                            <Tag className="w-2.5 h-2.5" />
                            Promoção
                          </span>
                        )}
                      </div>
                      {product.description && (
                        <p className="text-[11px] text-couro-ivory/35 mt-0.5 truncate max-w-xs">
                          {product.description}
                        </p>
                      )}
                    </div>

                    {/* Preços */}
                    <div className="text-right flex-shrink-0 hidden sm:block">
                      {product.is_promoted && product.promotional_price ? (
                        <>
                          <span className="line-through text-xs text-couro-ivory/30 font-mono block">
                            R$ {product.price.toFixed(2)}
                          </span>
                          <span className="text-couro-gold font-semibold font-mono text-sm">
                            R$ {product.promotional_price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-couro-ivory font-semibold font-mono text-sm">
                          R$ {product.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-2 text-couro-ivory/40 hover:text-couro-gold hover:bg-couro-gold/10 rounded transition-colors cursor-pointer"
                        aria-label="Editar produto"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {deleteConfirm === product.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-[10px] text-red-400 hover:text-red-300 border border-red-900/40 hover:border-red-700/40 px-2 py-1 rounded transition-colors cursor-pointer"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-[10px] text-couro-ivory/30 hover:text-couro-ivory px-2 py-1 rounded transition-colors cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-2 text-couro-ivory/40 hover:text-red-400 hover:bg-red-950/20 rounded transition-colors cursor-pointer"
                          aria-label="Excluir produto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* ── Product Form Modal ── */}
      <AnimatePresence>
        {formOpen && (
          <ProductForm
            key={editing?.id ?? 'new'}
            initial={editing}
            onClose={closeForm}
            onSaved={onSaved}
          />
        )}
      </AnimatePresence>

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {toast && <Toast key="toast" {...toast} />}
      </AnimatePresence>
    </div>
  )
}
