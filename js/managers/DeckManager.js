import { CARDS, getStarterDeck } from '../data/cards.js';
import { Card } from '../entities/Card.js';

export class DeckManager {
    constructor() {
        this.drawPile = [];
        this.hand = [];
        this.discardPile = [];
        this.exhaustPile = [];
        this.temporaryCards = [];
        this.lockedCards = [];
        this.maxHandSize = 10;
        this.initializeStarterDeck();
    }

    initializeStarterDeck() {
        this.drawPile = [...getStarterDeck()];
        this.shuffleDeck();
    }
    
    addCard(card) {
        this.discardPile.push(card);
        return true;
    }
    
    removeCard(card) {
        const removeFromPile = (pile, cardToRemove) => {
            for (let i = 0; i < pile.length; i++) {
                if (pile[i].id === cardToRemove.id) {
                    pile.splice(i, 1);
                    return true;
                }
            }
            return false;
        };
        
        return removeFromPile(this.drawPile, card) ||
               removeFromPile(this.hand, card) ||
               removeFromPile(this.discardPile);
    }
    
    upgradeCard(card) {
        const findAndUpgrade = (pile) => {
            for (let i = 0; i < pile.length; i++) {
                if (pile[i].id === card.id) {
                    if (!pile[i].upgraded) {
                        pile[i].upgraded = true;
                        pile[i].name = pile[i].name + '+';
                        
                        if (pile[i].effects) {
                            for (const effect of pile[i].effects) {
                                if (effect.type === 'damage' || effect.type === 'defense') {
                                    effect.value = Math.floor(effect.value * 1.5);
                                } else if (effect.type === 'heal' || effect.type === 'buff' || effect.type === 'debuff') {
                                    if (effect.value) effect.value++;
                                    if (effect.duration) effect.duration++;
                                }
                            }
                        }
                        
                        return true;
                    }
                }
            }
            return false;
        };
        
        return findAndUpgrade(this.drawPile) || 
               findAndUpgrade(this.hand) ||
               findAndUpgrade(this.discardPile);
    }
    
    upgradeRandomCards(count = 1) {
        const cards = this.getAllCards().filter(card => !card.upgraded);
        
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        
        let upgradedCount = 0;
        for (let i = 0; i < Math.min(count, cards.length); i++) {
            if (this.upgradeCard(cards[i])) {
                upgradedCount++;
            }
        }
        
        return upgradedCount;
    }
    
    upgradeAllCards() {
        const cards = this.getAllCards().filter(card => !card.upgraded);
        let upgradedCount = 0;
        
        for (const card of cards) {
            if (this.upgradeCard(card)) {
                upgradedCount++;
            }
        }
        
        return upgradedCount;
    }
    
    findCardById(cardId) {
        let card = this.drawPile.find(c => c.id === cardId);
        if (card) return card;
        
        card = this.discardPile.find(c => c.id === cardId);
        if (card) return card;
        
        card = this.hand.find(c => c.id === cardId);
        if (card) return card;
        
        return this.exhaustPile.find(c => c.id === cardId);
    }
    
    drawCard() {
        if (this.drawPile.length === 0) {
            this.recycleDiscardPile();
            if (this.drawPile.length === 0) {
                return null;
            }
        }
        
        if (this.hand.length >= this.maxHandSize) {
            return null;
        }
        
        const card = this.drawPile.pop();
        this.hand.push(card);
        return card;
    }
    
    recycleDiscardPile() {
        this.drawPile = [...this.discardPile];
        this.discardPile = [];
        this.shuffleDeck();
    }
    
    drawCards(amount) {
        const drawnCards = [];
        for (let i = 0; i < amount; i++) {
            const card = this.drawCard();
            if (card) {
                drawnCards.push(card);
            } else {
                break;
            }
        }
        return drawnCards;
    }
    
    discardCard(index) {
        if (index >= 0 && index < this.hand.length) {
            const card = this.hand.splice(index, 1)[0];
            this.discardPile.push(card);
            return card;
        }
        return null;
    }
    
    discardHand() {
        this.discardPile.push(...this.hand);
        const discarded = [...this.hand];
        this.hand = [];
        return discarded;
    }
    
    exhaustCard(index) {
        if (index >= 0 && index < this.hand.length) {
            const card = this.hand.splice(index, 1)[0];
            this.exhaustPile.push(card);
            return card;
        }
        return null;
    }
    
    addTemporaryCard(card) {
        const tempCard = { ...card, temporary: true, id: card.id + '_temp_' + Date.now() };
        this.hand.push(tempCard);
        this.temporaryCards.push(tempCard.id);
        return tempCard;
    }
    
    lockCard(cardId, duration = 1) {
        this.lockedCards.push({
            cardId,
            duration
        });
    }
    
    unlockCards() {
        this.lockedCards = this.lockedCards
            .map(lock => ({ ...lock, duration: lock.duration - 1 }))
            .filter(lock => lock.duration > 0);
    }
    
    isCardLocked(cardId) {
        return this.lockedCards.some(lock => lock.cardId === cardId);
    }
    
    shuffleDeck() {
        for (let i = this.drawPile.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.drawPile[i], this.drawPile[j]] = [this.drawPile[j], this.drawPile[i]];
        }
    }
    
    startTurn() {
        this.unlockCards();
        this.cleanTemporaryCards();
    }
    
    endTurn() {
        this.discardHand();
    }
    
    cleanTemporaryCards() {
        this.hand = this.hand.filter(card => !card.temporary);
        this.drawPile = this.drawPile.filter(card => !card.temporary);
        this.discardPile = this.discardPile.filter(card => !card.temporary);
        this.temporaryCards = [];
    }
    
    encryptCards(count) {
        const cards = this.drawPile;
        if (cards.length === 0) return 0;
        
        const shuffled = [...cards].sort(() => 0.5 - Math.random());
        const toEncrypt = shuffled.slice(0, Math.min(count, shuffled.length));
        
        for (const card of toEncrypt) {
            card.encrypted = true;
            card.encryptedTurns = 2;
        }
        
        return toEncrypt.length;
    }
    
    decryptCards() {
        let decryptedCount = 0;
        
        const decryptPile = (pile) => {
            for (const card of pile) {
                if (card.encrypted) {
                    if (--card.encryptedTurns <= 0) {
                        card.encrypted = false;
                        card.encryptedTurns = 0;
                        decryptedCount++;
                    }
                }
            }
        };
        
        decryptPile(this.drawPile);
        decryptPile(this.hand);
        decryptPile(this.discardPile);
        
        return decryptedCount;
    }
    
    transformRandomCards(count, quality = 'random') {
        const cards = this.drawPile.concat(this.discardPile);
        if (cards.length === 0) return 0;
        
        const shuffled = [...cards].sort(() => 0.5 - Math.random());
        const toTransform = shuffled.slice(0, Math.min(count, shuffled.length));
        
        for (const card of toTransform) {
            this.removeCard(card);
            
            let newRarity;
            if (quality === 'improve') {
                if (card.rarity === 'common') newRarity = 'uncommon';
                else if (card.rarity === 'uncommon') newRarity = 'rare';
                else newRarity = card.rarity;
            } else if (quality === 'same_rarity') {
                newRarity = card.rarity;
            } else {
                const rarityRoll = Math.random();
                if (rarityRoll < 0.6) newRarity = card.rarity;
                else if (rarityRoll < 0.9) newRarity = 'uncommon';
                else newRarity = 'rare';
            }
            
            const newCard = this.getRandomCardByRarity(newRarity);
            
            if (newCard) this.discardPile.push(newCard);
        }
        
        return toTransform.length;
    }
    
    transformSpecificCards(cards, quality = 'random') {
        const newCards = [];
        
        for (const card of cards) {
            this.removeCard(card);
            
            let newRarity;
            if (quality === 'improve') {
                if (card.rarity === 'common') newRarity = 'uncommon';
                else if (card.rarity === 'uncommon') newRarity = 'rare';
                else newRarity = card.rarity;
            } else if (quality === 'same_rarity') {
                newRarity = card.rarity;
            } else {
                const rarityRoll = Math.random();
                if (rarityRoll < 0.6) newRarity = card.rarity;
                else if (rarityRoll < 0.9) newRarity = 'uncommon';
                else newRarity = 'rare';
            }
            
            const newCard = this.getRandomCardByRarity(newRarity);
            
            if (newCard) {
                this.discardPile.push(newCard);
                newCards.push(newCard);
            }
        }
        
        return newCards;
    }
    
    getRandomCardByRarity(rarity) {
        const cards = Object.values(CARDS).filter(c => c.rarity === rarity);
        
        if (cards.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * cards.length);
        return { ...cards[randomIndex] };
    }
    
    getAllCards() {
        return [
            ...this.drawPile,
            ...this.hand,
            ...this.discardPile,
            ...this.exhaustPile
        ];
    }
    
    getCardCounts() {
        return {
            deck: this.drawPile.length,
            hand: this.hand.length,
            discard: this.discardPile.length,
            exhaust: this.exhaustPile.length,
            encrypted: this.getAllCards().filter(card => card.encrypted).length
        };
    }
    
    getCardById(id) {
        if (CARDS[id]) {
            return { ...CARDS[id] };
        }
        return null;
    }
    
    getRandomCards(count, rarity = null, team = null) {
        let cards = Object.values(CARDS);
        
        if (rarity) {
            cards = cards.filter(card => card.rarity === rarity);
        } else {
            cards = cards.filter(card => card.rarity !== 'starter');
        }
        
        if (team && team !== 'random') {
            cards = cards.filter(card => card.team === team);
        }
        
        if (cards.length === 0) return [];
        
        const shuffled = [...cards].sort(() => 0.5 - Math.random());
        
        return shuffled.slice(0, Math.min(count, shuffled.length)).map(card => ({ ...card }));
    }
    
    serialize() {
        return {
            drawPile: this.drawPile.map(card => card.serialize ? card.serialize() : card),
            discardPile: this.discardPile.map(card => card.serialize ? card.serialize() : card),
            exhaustPile: this.exhaustPile.map(card => card.serialize ? card.serialize() : card),
            lockedCards: this.lockedCards
        };
    }
    
    deserialize(data) {
        this.drawPile = data.drawPile.map(cardData => Card.deserialize(cardData));
        this.discardPile = data.discardPile.map(cardData => Card.deserialize(cardData));
        this.exhaustPile = data.exhaustPile.map(cardData => Card.deserialize(cardData));
        this.lockedCards = data.lockedCards || [];
        this.hand = [];
        this.temporaryCards = [];
    }
}
