import getStats from "index.html";

function createSidebar() {
  return (
    <div className="sidebar-comp">
      <h2 className="h2-sidebar">METAcraft server</h2>
      <div className="hr-sidebar"></div>

      <div className="head-group">
        <img className="img-head" src={playerhead}></img>
        <h2 className="h2-players">Players</h2>
        <p className="p-players">XX players online</p>
      </div>

      <div className="player-list-container">
        <ul>{window.users.map(p => (
          <li className="player-container" key={p.id} onClick={() => console.log("clicked")}>
            <div />
            <div className="player-name">{p}</div>
          </li>
        ))}
        </ul>
      </div>
      <div className="hr-sidebar"></div>
    </div>
  )
}

export default createSidebar;