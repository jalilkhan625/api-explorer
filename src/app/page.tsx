import Navbar from './components/Navbar'
import RequestEditor from './components/RequestEditor'

export default function Home() {
  return (
    <main className="p-4 max-w-4xl mx-auto pt-24 sm:pt-28">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">API Explorer</h1>
      <RequestEditor />
    </main>
  )
}