import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center py-20">
      <div className="px-4 text-center">
        <p className="text-7xl font-extrabold tracking-tight text-azure-200">404</p>
        <h1 className="mt-4 text-2xl font-extrabold text-navy-950">
          Такой страницы нет
        </h1>
        <p className="mx-auto mt-3 max-w-md text-navy-800/70">
          Возможно, ссылка устарела. Зато туры никуда не делись — начните с
          главной или загляните в горящие предложения.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-navy-950 px-6 py-3 font-bold text-white transition-colors hover:bg-navy-800"
          >
            На главную
          </Link>
          <Link
            href="/hot-tours"
            className="rounded-full bg-gold-400 px-6 py-3 font-bold text-navy-950 transition-colors hover:bg-gold-300"
          >
            Горящие туры
          </Link>
        </div>
      </div>
    </section>
  );
}
