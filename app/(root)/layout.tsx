import NavBar from "../../components/NavBar";

export default function layout({ children }: Readonly<{ children: React.ReactNode}>) {
  return (
    <main className="font-work-sans">
      <NavBar />
      {children}
    </main>
  )
}
