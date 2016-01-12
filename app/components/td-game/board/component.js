import Ember from 'ember';
import Mob from 'tower-defense/objects/mob';

export default Ember.Component.extend({
  allTowers: Ember.ArrayProxy.create({ content: Ember.A([]) }),

  towerGroups: Ember.A([]),

  classNames: ['td-game__board'],

  classNameBindings: ['positionRelative:td-game__board--relative'],

  numMobsGenerated: 1,

  positionRelative: false,

  mobs: Ember.A([]),

  mobSchema: null,

  _generateFirstMob(newMob) {
    this.get('mobs').pushObject(newMob);
    this.set('numMobsGenerated', this.get('numMobsGenerated') + 1);
  },

  _generateMobs(mobSchema, newMob, quantity, frequency) {
    setTimeout(() => {
      this.get('mobs').pushObject(newMob);
      this.set('numMobsGenerated', this.get('numMobsGenerated') + 1);
      if (this.get('numMobsGenerated') < quantity) {
        this._generateMobs(
          mobSchema, this._getNewMob(mobSchema), quantity, frequency
        );
      }
    }, frequency);
  },

  _getNewMob(mobSchema) {
    return Mob.create({
      frequency: mobSchema.frequency,
      number: this.get('numMobsGenerated'),
      points: mobSchema.points,
      posClass: null,
      posX: null,
      posY: null,
      quantity: mobSchema.quantity,
      remainingHealth: mobSchema.maxHealth,
      speed: mobSchema.speed,
      type: mobSchema.type
    });
  },

  _reduceMobHealth(mobId, healthToReduce) {
    if (!healthToReduce) {
      healthToReduce = 20;
    }

    this.get('mobs').forEach((mob) => {
      if (mobId === mob.get('id')) {
        const currentHealth = mob.get('remainingHealth');
        mob.set('remainingHealth', currentHealth - healthToReduce);
      }
    });
  },

  _mobInRangeOfTower(mob, tower, range) {
    function getDistance(mob, tower) {
      var latDiff = Math.abs(tower.get('posX') - mob.get('posX'));
      var lngDiff = Math.abs(tower.get('posY') - mob.get('posY'));
      return latDiff + lngDiff;
    }

    return getDistance(mob, tower) < range ? true : false;
  },

  attackMobsInTowerRange: Ember.observer('attrs.waveStarted', function () {
    setInterval(() => {
      if (!this.get('allTowers.length') || !this.get('mobs.length')) {
        return;
      }

      this.get('allTowers').forEach((tower) => {
        this.get('mobs').forEach((mob) => {
          if (this._mobInRangeOfTower(mob, tower, 100)) { // TODO: replace arg 3 with tower property for attack range, based on type?
            this._reduceMobHealth(mob.get('id'), 20); // TODO: replace arg 2 with tower property for attack power, based on type?
          }
        });
      });

      // this.get('mobs').forEach((mob) => {
      //   if (this._towersInRange(mob)) {
      //     this._reduceMobHealth(mob.get('id'), 20);
      //   }
      // });
    }, 500);
  }),

  getTowers: Ember.observer('attrs.waveStarted', function () {
    this.attrs.towerGroups.forEach((towerGroup) => {
      this.get('allTowers').pushObject(towerGroup);

      towerGroup.get('towers').forEach((tower) => {
        this.get('allTowers').pushObject(tower);
      });
    });
  }),

  produceMobs: Ember.observer('attrs.waveStarted', function () {
    this.attrs.mobs.forEach((mobSchema) => {
      switch (mobSchema.get('quantity')) {
        case 0:
          break;

        case 1:
          this._generateFirstMob(this._getNewMob(mobSchema));
          break;

        default:
          this._generateFirstMob(this._getNewMob(mobSchema));

          this._generateMobs(
            mobSchema,
            this._getNewMob(mobSchema),
            mobSchema.get('quantity') + 1,
            mobSchema.get('frequency')
          );
      }
    });
  }),

  repositionBoard: Ember.observer('attrs.waveStarted', function () {
    this.set('positionRelative', true);
  }),

  actions: {
    updateMobClass(mobNumber, newClass) {
      this.get('mobs').forEach((mob) => {
        if (mobNumber === mob.get('number')) {
          mob.set('posClass', newClass);
        }
      });
    },

    updateMobPosition(mobNumber, axis, pos) {
      this.get('mobs').forEach((mob) => {
        if (mobNumber === mob.get('number')) {
          mob.set('pos' + axis, pos);
        }
      });
    },

    updateTowerPosition(id, axis, pos) {
      axis = axis.toUpperCase();

      this.get('allTowers').forEach((tower) => {
        if (tower.get('id') === id) {
          tower.set('pos' + axis, pos);
        }
      });
    }
  }
});
