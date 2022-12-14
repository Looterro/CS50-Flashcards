class CardEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            front: "",
            back: "",
            learned: false,
        }
    }

    render() {

        const rows = this.props.cards.map((card, i) => {
            return (
                <tr key={i}>
                    <td>{card.front}</td>
                    <td>{card.back}</td>
                    <td><button data-index={i} data-id={card.id} onClick={this.changeLearned} className={card.learned ? "btn learned" : "btn not_learned"}>{card.learned ? "Yes" : "No"}</button></td>
                    <td><button class="btn btn-sm btn-danger"data-index={i} data-id={card.id} onClick={this.deleteCard}>Delete</button></td>
                </tr>
            )
        })

        return (
            <div className='card-edit'>
                <h2>Card Editor</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Front</th>
                            <th>Back</th>
                            <th>Learned</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <br />
                <input className="input" onChange={this.handleChange} name="front" placeholder="Front of Card" value={this.state.front} />
                <span> </span>
                <input className="input" onChange={this.handleChange} name="back" placeholder="Back of Card" value={this.state.back} />
                <span> </span>
                <button className="btn btn-sm btn-secondary" onClick={this.addCard}>Add Card</button>
                <hr />
                <button className="btn btn-sm btn-info" onClick={this.props.switchMode}>Go to Viewer</button>
            </div>
        )
    }

    handleChange = (event) => {
        this.setState({
            //using javascript to set the target name as a key and then add value
            [event.target.name]: event.target.value
        });
    }
    
    //call the props function to add cards and clear the contents of inputs
    addCard = () => {
        this.props.addCard(this.state.front, this.state.back, this.state.learned);
        fetch("/flashcards_compose", {
            method: 'POST',
            body: JSON.stringify({
                front: this.state.front,
                back: this.state.back
            })
        })

        this.setState({
            front: "",
            back: "",
        });
    }

    deleteCard = (event) => {

        fetch(`/flashcard_delete/${event.target.dataset.id}`, {
            method: 'PUT'
        })

        this.props.deleteCard(event.target.dataset.index)
    }

    changeLearned = (event) => {
        this.props.changeLearned(event.target.dataset.index, event.target.dataset.id)
    }

}

class CardViewer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            number: 0,
            front: true,
            localCards: this.props.cards.filter(card => card.learned === false),
        }
    }


    render() {

        const card = this.state.localCards[this.state.number];
        console.log(this.state.front);
        console.log(this.state.localCards);
        
        if(this.state.localCards.length === 0) {
            return (
                <div>
                    <br />
                    No cards to learn!
                    <br />
                    <hr />
                    <button className="btn btn-sm btn-info" onClick={this.props.switchMode}>Go to Editor</button>
                </div>
            )
        }

        return (
            <div>

                <h1>Card Viewer</h1>

                <div className={this.state.front ? "card card-front" : "card card-back"} onClick={this.changeSide}>
                    <strong>{this.state.front ? card.front : card.back}</strong>
                </div>
                <button className="btn btn-sm btn-success" onClick={this.changeCard}>Next Card</button><span> </span>
                <button className="btn btn-sm btn-success" onClick={this.shuffleCards}>Shuffle Cards</button><span> </span>
                <button className="btn btn-sm btn-success" onClick={this.changeLearned}>Mark as learned</button>
                <hr />
                <button className="btn btn-sm btn-info" onClick={this.props.switchMode}>Go to Editor</button>
            </div>
        )
    }

    changeSide = () => {
        this.setState(state => ({
            front: !state.front,
        }));
    }

    changeCard = () => {

        console.log(this.state.number);
        console.log(this.props.cards.length);
        const index = this.state.number + 1;

        if ( index < this.state.localCards.length) {

            this.setState(state => ({
                number: state.number + 1,
            }));

        }
    }

    changeLearned = () => {

        let card = this.state.localCards[this.state.number];

        //filter original card array and check for the same fron and the back to change that objects status of learned independently of the shuffled copyCards array
        this.props.changeLearned(this.props.cards.findIndex(object => { return object.id == card.id }), card.id);
        
        this.setState(state => ({
                localCards: state.localCards.filter(card => card.learned === false),
        }));
    }

    //Use this function to shuffle cards only in this component, without doing it in the main app so that once you come back to editor everything comes back to normal
    shuffleCards = () => {
            
        const shuffledCards = [ ...this.state.localCards ];
        
        for (let i = shuffledCards.length - 1; i > 0; --i) {
            const j = Math.floor(Math.random() * i);
            const temp = shuffledCards[i];
            shuffledCards[i] = shuffledCards[j];
            shuffledCards[j] = temp;
        };

        console.log(shuffledCards);

        this.setState(state => ({
                localCards: shuffledCards.filter(card => card.learned === false),
                number: 0,
        }));
        
    }


}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editor: true,
            cards: [],
            isLoaded: false,
        };
    }

    componentDidMount() {

        fetch("/flashcards")
        .then(response => response.json())
        .then(data => {

            this.setState({
                isLoaded: true,
                cards: data.flashcards
            });

            console.log(data.flashcards)
        })

    }

    render() {
        const { editor, cards, isLoaded } = this.state;
        console.log(this.state.cards)

        if (!isLoaded) {
            return (
                <div>loading...</div>
            )
        } else {

            if (this.state.editor) {

                return (
                   <CardEditor 
                        cards={this.state.cards}
                        switchMode={this.switchMode}
                        addCard={this.addCard}
                        deleteCard={this.deleteCard}
                        changeLearned={this.changeLearned}
                    /> 
                );
    
            } else {
    
                return (
                   <CardViewer
                   cards={this.state.cards}
                   switchMode={this.switchMode}
                   shuffleCards={this.shuffleCards}
                   changeLearned={this.changeLearned}
                   /> 
                );
    
            }
        }
        }
        

    switchMode = () => {
        this.setState(state => ({
            editor: !state.editor
        }));
    }

    addCard = (front, back, learned) => {

        let checkDoubles = this.state.cards.findIndex(object => { return object.front == front && object.back == back })
        console.log(checkDoubles)

        //Check if user added the same front and back of a card already and send a request to change them to a different value
        if (checkDoubles !== -1) {
            return alert('You already added that card!')
        }

        this.setState(state => ({
            cards: [...state.cards, {front: front, back: back, learned: learned }]
        }))
    }

    deleteCard = (index) => {
        this.setState(state => {
            const cards = [...state.cards];
            cards.splice(index, 1);
            return { cards: cards };
        });
    }

    //Get copy of cards and then change the status of learned at the corresponding index
    changeLearned = (index, id) => {

        fetch(`/flashcard/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                learned: !this.state.cards[index].learned
            })
        })

        this.setState(state => {
            const cards = [...state.cards];
            console.log(cards[index]);
            console.log(cards[index].learned);
            cards[index].learned = !cards[index].learned;
            return { cards: cards };
        });
    }

}

ReactDOM.render(<App />, document.querySelector("#app"));