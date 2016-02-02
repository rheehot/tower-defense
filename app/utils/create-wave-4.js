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
  board.set('imageUrl', '');

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

  const mobQuantity = 5;
  for (var i = 0; i < mobQuantity; i++) {
    const newMob = Mob.create({
      id: generateIdForRecord(),
      frequency: 2000,
      health: 350,
      maxHealth: 350,
      points: 20,
      quantity: mobQuantity,
      speed: 8, // seconds to cross one axis of the board
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
      selector: '.tg' + groupNum++,
      styles: Ember.A([createUnitCodeLine()])
    });
  }

  const towerGroup1 = getNewTowerGroup(3, 5);
  const towerGroup2 = getNewTowerGroup(3, 60);

  addTowersToTowerGroup(towerGroup1, 2);
  addTowersToTowerGroup(towerGroup2, 2);

  wave.set('towerGroups', Ember.A([towerGroup1, towerGroup2]));
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
  const wave = Wave.create({ minimumScore: 40 });

  addBoardToWave(wave);
  addMobsToWave(wave);
  addTowerGroupsToWave(wave);

  return wave;
}
