import LoadingPage from "./components/LoadingPage";
import UserHook from "./hooks/UserHook";
import AppRouter from "./routes/AppRouter";

function App() {

  const { isLoading } = UserHook();

  if(isLoading){
    return <LoadingPage />
  }

  return <AppRouter />
}

export default App;
