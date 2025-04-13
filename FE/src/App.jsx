import { BrowserRouter } from "react-router-dom";

import CustomRouter from "./Router/CustomRouter";
function App() {
  return (
    <BrowserRouter>
      <CustomRouter />
    </BrowserRouter>
  );
}

export default App;
