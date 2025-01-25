import { RouterProvider } from 'react-router-dom';
import router from './routes/index'

const App = () => {
  return (
    <div  className={`h-screen w-full mx-auto`}>
        <RouterProvider router={router} />
    </div>
  );
}
export default App;
