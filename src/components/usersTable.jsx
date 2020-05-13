import React from 'react';

const UsersTable = ({ players }) => {
  return (
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
              <td>{player.name}</td>
              <td>{player.score}</td>
              <td>{player.level}</td>
              <td>{player.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
