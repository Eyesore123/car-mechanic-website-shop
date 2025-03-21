'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import AdminAddProductForm from '@/components/AdminAddProductForm'
import AdminProductList from '@/components/AdminProductList'
import AdminModifyProduct from '@/components/AdminModifyProduct'
import  AdminOrderSearch from '@/components/AdminOrderSearch'
import AdminOrderList from '@/components/AdminOrderList'
import { RootState } from '@/redux/store/store'

// Testing:

import AdminSendNewsletter from '@/components/AdminSendNewsLetter'

export default function AdminPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const [activeComponent, setActiveComponent] = useState<'productList' | 'modifyProduct' | 'orderList' | 'orderSearch' | 'sendNewsLetter'>('productList')
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Ensure only admins can access this page
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/signin')
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== 'admin') {
    return null
  }

  // Conditionally render the active component
  const renderComponent = () => {
    switch (activeComponent) {
      case 'productList':
        return <AdminProductList onSelectProduct={(productId) => setSelectedProductId(productId)} />
      case 'modifyProduct':
        // Ensure productId is passed only if a product is selected
        return selectedProductId ? <AdminModifyProduct productId={selectedProductId} /> : null
      case 'orderList':
        return <AdminOrderList />
      case 'orderSearch':
        return <AdminOrderSearch />
      case 'sendNewsLetter':
        return <AdminSendNewsletter />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-[1fr_2fr] gap-6">
        <div>
          <h1 className='text-xl font-bold text-red-500 mb-4'>Hallinnointisivu: admin</h1>
          <div className='flex gap-4 justify-start mb-10'>

            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all hover:cursor-pointer" onClick={() => setActiveComponent('productList')}>
              Näytä Tuotelista
            </button>

            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 hover:cursor-pointer transition-all"
              onClick={() => setActiveComponent('modifyProduct')}
              disabled={!selectedProductId} // Disable if no product is selected
            >
              Muokkaa Tuotetta
          </button>

            <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all hover:cursor-pointer" onClick={() => setActiveComponent('orderList')}>
              Näytä Tilaukset
            </button>

            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all hover:cursor-pointer" onClick={() => setActiveComponent('orderSearch')}>
              Hae Tilauksia
            </button>

            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all hover:cursor-pointer" onClick={() => setActiveComponent('sendNewsLetter')}>
              Lähetä Uutiskirje
              </button>

          </div>
          <AdminAddProductForm />
        </div>

        <div>
          {renderComponent()}
        </div>
      </div>
    </div>
  )
}
