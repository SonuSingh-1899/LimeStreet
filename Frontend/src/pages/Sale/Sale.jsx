import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BadgePercent } from 'lucide-react'
import { motion } from 'framer-motion'
import Card from '../../Component/Product/Card'
import { buildApiUrl } from '../../utils/api'
import { PRODUCT_IMAGE_FALLBACK_SRC, handleProductImageError, resolveProductImageList } from '../../utils/image'

const SaleImageSlider = ({ products }) => {
  const sliderImages = products
    .flatMap((product) => resolveProductImageList(product).map((image) => ({
      image,
      name: product.name
    })))
    .filter((item) => item.image)

  if (sliderImages.length === 0) {
    return null
  }

  const marqueeImages = [...sliderImages, ...sliderImages]

  return (
    <div className="relative left-1/2 my-10 w-screen -translate-x-1/2 overflow-hidden">
      <motion.div
        className="flex w-max gap-3"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 28,
          ease: 'linear',
          repeat: Infinity
        }}
      >
        {marqueeImages.map((item, index) => (
          <div
            key={`${item.image}-${index}`}
            className="relative h-72 w-[82vw] shrink-0 overflow-hidden sm:h-96 sm:w-[48vw] lg:h-140 lg:w-[40vw]"
          >
            <img
              src={item.image || PRODUCT_IMAGE_FALLBACK_SRC}
              alt={item.name || 'Sale product'}
              className="h-full w-full object-cover"
              onError={handleProductImageError}
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

const Sale = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(buildApiUrl('/products/sale-items'))
      .then((response) => {
        setProducts(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-black px-4 py-14 pb-24 md:px-8 md:pb-14 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-white/10 pb-12 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Discount Collection</p>
          <h1 className="mt-4 text-5xl font-semibold text-white md:text-7xl">SALE PICKS</h1>
          <div className="mt-8 flex items-center justify-center gap-4 text-gray-300">
            <BadgePercent className="h-8 w-8 text-white" />
            <p className="max-w-xl text-sm leading-7 md:text-base">
              Discover your perfect fit with designs that speak your vibe — now on sale. Limited time, unlimited style.
            </p>
          </div>
        </div>

        {!loading && products.length > 0 && <SaleImageSlider products={products} />}

        <div className="py-12">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
            </div>
          ) : (
            products.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
                {products.map((item) => (
                  <Card key={item.id} product={item} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center text-gray-400">
                Sale products is not available.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default Sale
