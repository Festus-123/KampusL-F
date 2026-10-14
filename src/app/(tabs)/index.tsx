

import React, { useState } from 'react'
import { Text, View } from 'react-native'
import HeaderBadge from '@/components/header-badge/HeaderBadge'
import PopUps from '@/components/pop-up/PopUps'
import { useAuth } from '@/hooks/auth/useAuth'

const index = () => {


  return (
    <View className='flex-1 py-12 px-4'>
        {/* Header section */}
        <HeaderBadge />


    </View>
  )
}

export default index
