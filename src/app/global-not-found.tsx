import Link from "next/link";
import "./globals.css";

export default function GlobalNotFound() {
  return <html lang="ru"><body><main className="container section min-h-screen grid content-center justify-items-start gap-5">
    <p className="muted">404</p>
    <h1 className="ink text-4xl font-bold">Такой страницы нет / Бет табылмады</h1>
    <p className="muted">Выберите язык и вернитесь на главную.</p>
    <div className="flex flex-wrap gap-3"><Link href="/ru" className="button-primary">На главную</Link><Link href="/kk" className="button-secondary" lang="kk">Басты бетке</Link></div>
  </main></body></html>;
}
