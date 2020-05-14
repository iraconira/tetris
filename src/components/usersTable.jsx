import React from 'react';

const UsersTable = ({ players }) => {
  // console.log(players);

  const restartGame = () => window.location.reload();

  return (
    <div className='game-over-panel'>
      <div className='users-table'>
        <table>
          <thead>
            <tr>
              <th>name</th>
              <th>score</th>
              <th>level</th>
              <th>time</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, i) => (
              <tr key={i}>
                <td>{parseInt(i + 1) + '. ' + player.name}</td>
                <td>{player.score}</td>
                <td>{player.level}</td>
                <td>{player.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className='start-game' onClick={restartGame}>
        PLAY AGAIN
      </button>
      <div className='triangle-up'></div>
    </div>
  );
};

export default UsersTable;
