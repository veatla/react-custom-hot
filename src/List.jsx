import { useState } from "react";
import ListItem from "./ListItem";

const List = () => {
  const [list, set_list] = useState([
    {
      id: 0,
      name: "Todo",
    },
  ]);

  return list.map((value) => <ListItem key={value.id} {...value} />);
};
export default List;
