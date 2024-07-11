import "./App.scss";
import { ItemList } from "./components/ItemList";
import { Item } from "./components/ItemList/types";
import itemsData from "./components/ItemList/data.json";
import "./globalStyles.scss";

function App() {
  return (
    <div className="list-container">
      <ItemList items={itemsData as Item[]} />
    </div>
  );
}

export default App;
