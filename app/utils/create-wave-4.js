import Board from 'tower-defense/objects/board';
import createUnitCodeLine from 'tower-defense/utils/create-unit-code-line';
import Ember from 'ember';
import Mob from 'tower-defense/objects/mob';
import PathCoords from 'tower-defense/objects/path-coords';
import TowerGroup from 'tower-defense/objects/tower-group';
import Tower from 'tower-defense/objects/tower';
import Wave from 'tower-defense/objects/wave';

function addBoardToWave(wave) {
  const board = Board.create();
  board.set('imageUrl', '/images/path-4.png');

  const pathObjects = [
    PathCoords.create({ x: 5, y: -5 }),
    PathCoords.create({ x: 5, y: 25 }),
    PathCoords.create({ x: 35, y: 25 }),
    PathCoords.create({ x: 35, y: 40 }),
    PathCoords.create({ x: 65, y: 40 }),
    PathCoords.create({ x: 65, y: 25 }),
    PathCoords.create({ x: 90, y: 25 }),
    PathCoords.create({ x: 90, y: 75 }),
    PathCoords.create({ x: 35, y: 75 }),
    PathCoords.create({ x: 35, y: 105 })
  ];

  pathObjects.forEach((pathObject) => {
    board.get('pathData').pushObject(pathObject);
  });

  wave.set('board', board);
}

function addMobsToWave(wave) {
  const mobs = [];

  const mobQuantity = 10;
  for (var i = 0; i < mobQuantity; i++) {
    const newMob = Mob.create({
      id: generateIdForRecord(),
      frequency: 1500,
      health: 220,
      maxHealth: 220,
      points: 20,
      quantity: mobQuantity,
      speed: 10, // seconds to cross one axis of the board
      type: 'standard'
    });

    mobs.push(newMob);
  }
  wave.set('mobs', Ember.A(mobs));
}

function addTowerGroupsToWave(wave) {
  let groupNum = 1;

  function getNewTowerGroup(numRows, posY) {
    return TowerGroup.create({
      id: generateIdForRecord(),
      numRows: numRows,
      posY: 'board__tower-group--position-y' + posY,
      selector: 'tg' + groupNum++,
      styles: Ember.A([createUnitCodeLine()])
    });
  }

  const towerGroup1 = getNewTowerGroup(3, 4);
  const towerGroup2 = getNewTowerGroup(1, 46);
  const towerGroup3 = getNewTowerGroup(3, 60);

  addTowersToTowerGroup(towerGroup1, 2);
  addTowersToTowerGroup(towerGroup2, 1);
  addTowersToTowerGroup(towerGroup3, 2);

  wave.set('towerGroups', Ember.A([towerGroup1, towerGroup2, towerGroup3]));
}

function addTowersToTowerGroup(towerGroup, numTowers) {
  function getNewTower(towerNum) {
    return Tower.create({
      id: generateIdForRecord(),
      attackPower: 20,
      attackRange: 20,
      selector: 't' + towerNum,
      type: 1,
      styles: Ember.A([createUnitCodeLine()])
    });
  }

  let newTowers = Ember.A([]);
  for (var i = 1; i < numTowers + 1; i++) {
    newTowers.pushObject(getNewTower(i));
  }

  towerGroup.set('towers', newTowers);
}

function generateIdForRecord() {
  function generate4DigitString() {
    const baseInt = Math.floor((1 + Math.random()) * 0x10000);
    return baseInt.toString(16).substring(1);
  }

  return generate4DigitString() + generate4DigitString() + '-' +
         generate4DigitString() + '-' + generate4DigitString() + '-' +
         generate4DigitString() + '-' + generate4DigitString() +
         generate4DigitString() + generate4DigitString();
}

export default function createWave4() {
  const wave = Wave.create({
    instructions: `Now some of the groups have vertical space, which is the
                   perfect opportunity to use the align-items property.
                   align-items positions items vertically in a container and
                   accepts the following values:

* flex-start: align items across the top of the container
* flex-end: align items across the bottom of the container
* center: align items vertically across the center of the container
* baseline: align items across the baseline of the container
* stretch: stretch items to fill the container

Apply both align-items and justify-content properties to the groups to keep the
enemies at bay.`,
    minimumScore: 80
  });

  addBoardToWave(wave);
  addMobsToWave(wave);
  addTowerGroupsToWave(wave);

  return wave;
}
