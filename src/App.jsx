import { useState } from 'react'
import MainMenu from './pages/MainMenu'
import FishPage from './pages/FishPage'
import RoomPage from './pages/RoomPage'
import CodexPage from './pages/CodexPage'
import ShopPage from './pages/ShopPage'
import SettingsPage from './pages/SettingsPage'

const PAGES = {
  fish: FishPage,
  room: RoomPage,
  codex: CodexPage,
  shop: ShopPage,
  settings: SettingsPage,
}

export default function App() {
  const [page, setPage] = useState(null) // null = main menu

  const handleNavigate = id => setPage(id)
  const handleBack = () => setPage(null)

  if (page === null) {
    return <MainMenu onNavigate={handleNavigate} />
  }

  const PageComponent = PAGES[page]
  return <PageComponent onBack={handleBack} />
}