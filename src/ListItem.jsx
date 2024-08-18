import PropTypes from "prop-types";

const ListItem = (props) => {
  const { id, name } = props;

  return <div>{name}</div>;
};

ListItem.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
};
export default ListItem;
