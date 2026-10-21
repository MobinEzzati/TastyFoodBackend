import React from "react";

function MenuCard({ item, onSelect }) {
  return (
    <div className="menu-card" onClick={() => onSelect(item)}>
      <div className="menu-card__image-wrap">
        <img src={item.image_url} alt={item.name} className="menu-card__image" />
      </div>
      <div className="menu-card__body">
        <h3 className="menu-card__title">{item.name}</h3>
        <div className="menu-card__footer">
          <span className="menu-card__price">${item.price.toFixed(2)}</span>
          <span className="menu-card__tag">{item.category}</span>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
