

import React, { useState } from 'react'
import HeaderBadge from "@/components/header-badge/HeaderBadge";
import ItemsDisplay from "@/components/items-display/ItemsDisplay";
import ScoreBoard from "@/components/score-board/ScoreBoard";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className='flex-1 py-8 px-4'>
        {/* Header section */}
        <HeaderBadge />
        <ScoreBoard />
        <ItemsDisplay />
    </SafeAreaView>
  );
}
