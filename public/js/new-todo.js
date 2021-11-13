const newLiContent = (text) => `
    <div class="view">
        <input class="toggle" type="checkbox">
        <label>${text}</label>
        <button class="destroy"></button>
    </div>
    <input class="edit" value="">
  `;

module.exports = {
  newLiContent,
};
