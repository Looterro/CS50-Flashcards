class CardEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            front: "",
            back: ""
        }
    }

    render() {

        const rows = this.props.cards.map((card, i) => {
            return (
                <tr key={i}>
                    <td>{card.front}</td>
                    <td>{card.back}</td>
                    <td><button data-index={i} onClick={this.deleteCard}>Delete</button></td>
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
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <br />
                <input onChange={this.handleChange} name="front" placeholder="Front of Card" value={this.state.front} />
                <input onChange={this.handleChange} name="back" placeholder="Back of Card" value={this.state.back} />
                <button onClick={this.addCard}>Add Card</button>
                <hr />
                <button onClick={this.props.switchMode}>Go to Viewer</button>
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
        this.props.addCard(this.state.front, this.state.back);
        this.setState({
            front: "",
            back: ""
        });
    }

    deleteCard = (event) => {
        this.props.deleteCard(event.target.dataset.index)
    }

}

class CardViewer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            number: 0,
            front: true,
            cardsCopy: this.props.cards,
        }
    }


    render() {

        const card = this.state.cardsCopy[this.state.number];
        console.log(this.state.front);
        console.log(this.state.cardsCopy)

        return (
            <div>

                <h1>Card Viewer</h1>

                <div className={this.state.front ? "card card-front" : "card card-back"} onClick={this.changeSide}>
                    <strong>{this.state.front ? card.front : card.back}</strong>
                </div>
                <button onClick={this.changeCard}>Next Card</button>
                <button onClick={this.shuffleCards}>Shuffle Cards</button>
                <hr />
                <button onClick={this.props.switchMode}>Go to Editor</button>
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

        if ( index < this.props.cards.length) {

            this.setState(state => ({
                number: state.number + 1,
            }));
        }
    }

    shuffleCards = () => {
                        
        const shuffledCards = [ ...this.state.cardsCopy ];
        
        for (let i = shuffledCards.length - 1; i > 0; --i) {
            const j = Math.floor(Math.random() * i);
            const temp = shuffledCards[i];
            shuffledCards[i] = shuffledCards[j];
            shuffledCards[j] = temp;
        };

        console.log(shuffledCards);

        this.setState(state => ({
                cardsCopy: shuffledCards,
        }));
        
    }

}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editor: true,
            cards: []
        };
    }

    render() {

        if (this.state.editor) {

            return (
               <CardEditor 
                    cards={this.state.cards}
                    switchMode={this.switchMode}
                    addCard={this.addCard}
                    deleteCard={this.deleteCard}
                /> 
            );

        } else {

            return (
               <CardViewer
               cards={this.state.cards}
               switchMode={this.switchMode}
               /> 
            );

        }
    }

    switchMode = () => {
        this.setState(state => ({
            editor: !state.editor
        }));
    }

    addCard = (front, back) => {
        this.setState(state => ({
            cards: [...state.cards, { front: front, back: back }]
        }))
    }

    deleteCard = (index) => {
        this.setState(state => {
            const cards = [...state.cards];
            cards.splice(index, 1);
            return { cards: cards };
        });
    }

}

ReactDOM.render(<App />, document.querySelector("#app"));