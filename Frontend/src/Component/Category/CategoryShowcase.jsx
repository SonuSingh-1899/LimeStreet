import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { buildApiUrl } from '../../utils/api'
import { PRODUCT_IMAGE_FALLBACK_SRC, handleProductImageError, resolveProductImageList } from '../../utils/image'

const fallbackCategories = [
  { name: 'T-Shirts', count: 0 },
  { name: 'Oversized', count: 0 },
  { name: 'Graphic', count: 0 }
]

const CategoryShowcase = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    axios.get(buildApiUrl('/products'))
      .then((response) => setProducts(response.data || []))
      .catch((error) => console.log(error))
  }, [])

  const categories = useMemo(() => {
    const categoryMap = new Map()

    products.forEach((product) => {
      const categoryName = product.category?.trim()

      if (!categoryName) {
        return
      }

      const existingCategory = categoryMap.get(categoryName) || {
        name: categoryName,
        count: 0,
        image: ''
      }

      existingCategory.count += 1
      existingCategory.image = existingCategory.image || resolveProductImageList(product)[0] || ''
      categoryMap.set(categoryName, existingCategory)
    })

    const productCategories = Array.from(categoryMap.values())
    return productCategories.length ? productCategories : fallbackCategories
  }, [products])

  return (
    <section className="bg-black px-4 py-14 md:px-8 md:py-20 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Shop Faster</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">Shop By Category</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-gray-400 md:text-base">
            Pick a category and jump straight into matching LimeStreet products.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/category/${encodeURIComponent(category.name)}`}
              className="group relative min-h-72 overflow-hidden rounded-lg border border-white/10 bg-zinc-950"
            >
              <img
                src={category.image || PRODUCT_IMAGE_FALLBACK_SRC}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                onError={handleProductImageError}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/60">
                    {category.count ? `${category.count} products` : 'Explore'}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{category.name}</h3>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition group-hover:translate-x-1">
                  <ArrowRight size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryShowcase
