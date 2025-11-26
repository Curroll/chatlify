import { Route, Routes } from "react-router"
import SignUpPage from "./pages/signUpPage"
import ChatPage from "./pages/chatPage"
import LoginPage from "./pages/loginPage"
import Bg from "./bg"


const App = () => {
  return (
<div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">

<Bg/>

<Routes>
  <Route path="/signup" element={<SignUpPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/chat" element={<ChatPage />} />
 </Routes>
</div>
  )
}

export default App