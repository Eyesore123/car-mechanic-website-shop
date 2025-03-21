import React, { useState, useEffect, useRef } from 'react'
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase/firebaseConfig'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { RotatingLines } from 'react-loader-spinner'

interface Product {
  id?: string
  name: string
  description: string
  price: number
  imageUrl: string
  availability: string
  category: string
}

interface AdminModifyProductProps {
  productId: string;
}

const AdminModifyProduct: React.FC<AdminModifyProductProps> = ({ productId }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    availability: '',
    category: '',
  })
  const [loading, setLoading] = useState(true)
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setLoading(false)
        return
      }

      try {
        // First try: Assume productId is the Firestore document ID
        const directRef = doc(db, 'products', productId)
        const directSnapshot = await getDoc(directRef)

        if (directSnapshot.exists()) {
          const productData = directSnapshot.data() as Product
          setSelectedProduct(productData)
          setDocumentId(productId)
          setFormData({
            name: productData.name || '',
            description: productData.description || '',
            price: productData.price?.toString() || '0',
            imageUrl: productData.imageUrl || '',
            availability: productData.availability || '',
            category: productData.category || '',
          })
          setImagePreview(productData.imageUrl || null)
          setLoading(false)
          return
        }

        // Second try: Query for a product with matching id field
        const productsRef = collection(db, 'products')
        const q = query(productsRef, where("id", "==", productId))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const docSnapshot = querySnapshot.docs[0]
          const firestoreDocId = docSnapshot.id
          const productData = docSnapshot.data() as Product
          
          setSelectedProduct(productData)
          setDocumentId(firestoreDocId)
          setFormData({
            name: productData.name || '',
            description: productData.description || '',
            price: productData.price?.toString() || '0',
            imageUrl: productData.imageUrl || '',
            availability: productData.availability || '',
            category: productData.category || '',
          })
          setImagePreview(productData.imageUrl || null)
        } else {
          toast.error('Tuotetta ei löytynyt')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Virhe tuotteen haussa')
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchProduct()
  }, [productId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
    
    // Update image preview if URL is changed manually
    if (name === 'imageUrl') {
      setImagePreview(value)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setImageFile(file)
      
      // Preview URL for the selected image
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const handleImageUpload = async () => {
    if (!imageFile || !documentId) return
    
    setUploadingImage(true)
    try {
      // Reference to the storage location
      const storageRef = ref(storage, `product-images/${documentId}_${imageFile.name}`)
      
      // Upload the file
      await uploadBytes(storageRef, imageFile)
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef)
      
      // Update the form data with the new URL
      setFormData(prev => ({
        ...prev,
        imageUrl: downloadURL
      }))
      
      // Update the image preview
      setImagePreview(downloadURL)
      
      toast.success('Kuva ladattu onnistuneesti!')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Kuvan latauksessa tapahtui virhe')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }))
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProduct || !documentId) {
      toast.error('Tuotetta ei ole valittu tai sitä ei löydy')
      return
    }

    // Ensure the price is a valid number before updating
    const priceValue = Number(formData.price)
    if (isNaN(priceValue)) {
      toast.error('Hinta ei ole kelvollinen!')
      return
    }

    // Use the stored document ID for the update
    const productRef = doc(db, 'products', documentId)

    try {
      await updateDoc(productRef, {
        name: formData.name,
        description: formData.description,
        price: priceValue,
        imageUrl: formData.imageUrl,
        availability: formData.availability,
        category: formData.category,
      })

      toast.success('Tuote päivitetty onnistuneesti!')
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Tuotteen päivityksessä tapahtui virhe')
    }
  }

  if (loading) {
    return (<><div className='text-xl font-bold text-center mb-6 mt-20'>Ladataan valittua tuotetta...</div>
    <div className="flex justify-center items-center mt-20">
        <RotatingLines
            width="80"
            height="80"
            color="#4fa94d"
            ariaLabel="loading"
            strokeWidth="4"
            animationDuration="0.75"
            visible={true}
        />
    </div>
        </>
    );
  }

  if (!selectedProduct) {
    return <div>Tuotetta ei löytynyt.</div>
  }

  return (
    <div className="modify-product bg-white p-6 w-full rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Muokkaa tuotetta</h2>
      <form onSubmit={handleUpdateProduct} className="space-y-4 !w-full">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tuotenimi:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
        </div>


        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Kuvaus:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="mt-6 block !w-180 !h-50 rounded-md border border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-center"
              style={{ textAlign: 'center' }}
            />
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hinta:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Saatavuus (numero tai kirjoita "tilauksesta"):
            <input
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategoria:
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
        </div>
        
        {/* Image section with preview and upload functionality */}
        <div className="space-y-2">
          <p className="block text-sm font-medium text-gray-700">Tuotekuva:</p>
          
          {/* Image preview */}
          {imagePreview && (
            <div className="relative w-full h-48 border rounded-md overflow-hidden mb-2">
              <img 
                src={imagePreview} 
                alt="Tuotteen esikatselu" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/images/icon.png"; // Fallback image
                }}
              />
              <button 
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 hover:cursor-pointer"
                title="Poista kuva"
              >
                ✕
              </button>
            </div>
          )}
          
          {/* Image URL input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 mt-6">
              Kuva URL:
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>
          
          {/* File upload section */}
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700 mb-1">Tai lataa uusi kuva:</p>
            <div className='flex flex-col justify-center items-center'>
                <div className='mb-10'>Huom! Paina ensin punaista rastia poistaaksesi kuvan. Sitten valitse kuva, jonka haluat ladata ja paina lataa-painiketta.</div>
                    <div className="flex items-center space-x-2">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        ref={fileInputRef}
                        className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={!imageFile || uploadingImage}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                        !imageFile || uploadingImage
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        {uploadingImage ? 'Ladataan...' : 'Lataa'}
                    </button>
                </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            className="submitbtn"
          >
            Päivitä tuote
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminModifyProduct
