import Search from '@/components/search/Search'
import React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


const search = () => {
  return (
    <SafeAreaView className='flex-1'>
      
       <Search />
    </SafeAreaView>
  )
}

export default search
