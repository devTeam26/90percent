import { useEffect, useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setSearchOpen } from '@/features/ui/store/uiSlice'
import { useGetProductsQuery } from '@/data/useMockData'
import { debounce } from '@/lib/utils'

const CATEGORIES = [
  { label: 'Power Banks', href: '/categories/power-banks' },
  { label: 'Accessories', href: '/categories/accessories' },
  { label: 'Speakers',    href: '/categories/speakers'    },
]

const DISPLAY_LIMIT = 8

export default function SearchModal() {
  const dispatch = useAppDispatch()
  const open = useAppSelector((s) => s.ui.searchOpen)
  const inputRef = useRef<HTMLInputElement>(null)
  const [input, setInput] = useState('')
  const [debouncedInput, setDebouncedInput] = useState('')

  const debouncedUpdate = useMemo(
    () => debounce((val: string) => setDebouncedInput(val), 300),
    []
  )

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
    else { setInput(''); setDebouncedInput('') }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch(setSearchOpen(false))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, dispatch])

  const isSearching = debouncedInput.length >= 1
  const searchFilters = useMemo(
    () => ({ query: debouncedInput, limit: 200 }),
    [debouncedInput]
  )
  const { data } = useGetProductsQuery(searchFilters)
  const allResults = isSearching ? (data?.data ?? []) : []
  const results = allResults.slice(0, DISPLAY_LIMIT)
  const total = allResults.length

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1C2B28]/50 backdrop-blur-sm"
            onClick={() => dispatch(setSearchOpen(false))}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed inset-x-0 top-0 z-50 mx-auto max-w-2xl px-4 pt-4"
          >
            <div className="overflow-hidden rounded-2xl border border-[#D4E0DD] bg-white shadow-2xl">

              {/* Input */}
              <div className="flex items-center gap-3 border-b border-[#D4E0DD] px-4 py-3.5">
                <Search className="size-5 shrink-0 text-[#999]" />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => { setInput(e.target.value); debouncedUpdate(e.target.value) }}
                  placeholder="Search products across all categories..."
                  className="flex-1 bg-transparent text-base text-[#1C2B28] outline-none placeholder:text-[#bbb]"
                />
                {input && (
                  <button onClick={() => { setInput(''); setDebouncedInput(''); inputRef.current?.focus() }}>
                    <X className="size-4 text-[#bbb] hover:text-[#1C2B28] transition-colors" />
                  </button>
                )}
                <button
                  className="text-xs text-[#bbb] hidden sm:block border border-[#D4E0DD] rounded px-2 py-0.5"
                  onClick={() => dispatch(setSearchOpen(false))}
                >ESC</button>
              </div>

              {/* Results */}
              <div className="max-h-[65vh] overflow-y-auto">
                {isSearching ? (
                  results.length > 0 ? (
                    <div className="p-3">
                      <div className="mb-2 flex items-center justify-between px-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#bbb]">
                          Products
                        </p>
                        <p className="text-[10px] text-[#bbb]">
                          {total > DISPLAY_LIMIT ? `Showing ${DISPLAY_LIMIT} of ${total}` : `${total} result${total !== 1 ? 's' : ''}`}
                        </p>
                      </div>
                      {results.map((p) => (
                        <Link
                          key={p.id}
                          to={`/products/${p.slug}`}
                          onClick={() => dispatch(setSearchOpen(false))}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#EEF3F2] transition-colors group"
                        >
                          {p.images[0]?.url && (
                            <img
                              src={p.images[0].url}
                              alt={p.name}
                              className="size-12 rounded-lg object-contain bg-[#EEF3F2] p-1 shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8BADA4] mb-0.5">
                              {p.category.name}
                            </p>
                            <p className="text-sm font-medium text-[#1C2B28] truncate">{p.name}</p>
                          </div>
                          <ArrowRight className="size-4 text-[#bbb] group-hover:text-[#8BADA4] transition-colors shrink-0" />
                        </Link>
                      ))}
                      {total > DISPLAY_LIMIT && (
                        <p className="mt-2 px-3 text-center text-xs text-[#bbb]">
                          Refine your search to see more specific results
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="py-10 text-center text-[#bbb]">
                      <p className="text-sm">No products found for "<strong className="text-[#1C2B28]">{debouncedInput}</strong>"</p>
                      <p className="mt-1 text-xs">Try a different keyword or browse categories below</p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2 px-4">
                        {CATEGORIES.map((c) => (
                          <Link
                            key={c.href}
                            to={c.href}
                            onClick={() => dispatch(setSearchOpen(false))}
                            className="rounded-full border border-[#D4E0DD] px-4 py-1.5 text-xs font-semibold text-[#1C2B28] hover:border-[#8BADA4] hover:text-[#8BADA4] transition-colors"
                          >{c.label}</Link>
                        ))}
                      </div>
                    </div>
                  )
                ) : (
                  <div className="p-4">
                    <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-[#bbb]">Browse Categories</p>
                    <div className="flex flex-wrap gap-2 px-2">
                      {CATEGORIES.map((c) => (
                        <Link
                          key={c.href}
                          to={c.href}
                          onClick={() => dispatch(setSearchOpen(false))}
                          className="rounded-full border border-[#D4E0DD] px-4 py-1.5 text-xs font-semibold text-[#1C2B28] hover:border-[#8BADA4] hover:text-[#8BADA4] transition-colors"
                        >{c.label}</Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
