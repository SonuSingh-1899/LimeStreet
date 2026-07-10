import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Card from '../../Component/Product/Card'
import { buildApiUrl } from '../../utils/api'

const CategoryPage = () => {
  const { categoryName } = useParams()
  const decodedCategory = decodeURIComponent(categoryName || '')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios.get(buildApiUrl('/products'))
      .then((response) => setProducts(response.data || []))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false))
  }, [])

  const categoryProducts = useMemo(() => (
    products.filter((product) => (
      product.category?.trim().toLowerCase() === decodedCategory.trim().toLowerCase()
    ))
  ), [decodedCategory, products])

  return (
    <div className="min-h-screen bg-black px-4 py-14 pb-24 md:px-8 md:pb-14 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-white/10 pb-10 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Category</p>
          <h1 className="mt-4 text-5xl font-semibold text-white md:text-7xl">{decodedCategory}</h1>
        </div>

        <div className="py-12">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
            </div>
          ) : (
            categoryProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
                {categoryProducts.map((item) => (
                  <Card key={item.id} product={item} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center text-gray-400">
                Is category me products abhi available nahi hain.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryPage
