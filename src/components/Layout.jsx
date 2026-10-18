import Header from './Header'

export default function Layout({ children, title, onBack, rightAction }) {
  return (
    <div className="min-h-screen bg-ocean-900 text-white flex flex-col">
      <Header title={title} onBack={onBack} rightAction={rightAction} />
      <main className="flex-1 overflow-y-auto pb-6">
        {children}
      </main>
    </div>
  )
}