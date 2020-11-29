import React from 'react'
import { Button, Modal, Accordion, Badge, Card } from 'react-bootstrap'
import Moment from 'react-moment';


class RecipeModal extends React.PureComponent{

    constructor(props){
        super(props);

        this.state = {
            showHide : false,
            submitBtnText : 'Save'
        }
    }
    
    componentWillReceiveProps(props){
        if (!this.state.showHide && props.data.recipe) {
            this.handleModal();
        }
    }

    handleModal() {
        this.setState({ showHide: !this.state.showHide});
    }

    handleSubmit() {
        this.handleModal();
    }

    handleModalTitle() {
        let title = '';

        if (this.props.data.recipe) {
            title = this.props.data.recipe.title;

            if (this.props.data.action !== 'view') {
                title = this.Capitalize(this.props.data.action) + ' ' + title;
            }
        }

        return title;
    }

    displayIngredient(ingredient) {
        if (ingredient.length !== 0) {
            let ingredientText = (ingredient.amount ? ingredient.amount + ' ' : '') + (ingredient.measurement ? ingredient.measurement + ' of ' : ' ') + this.Capitalize(ingredient.name);
            let specialOffer;

            if (this.props.data.specials.length !== 0) {
                let specials = this.props.data.specials;

                specials.find((special) => {
                    if (special.ingredientId === ingredient.uuid) {
                        specialOffer = special;
                    }
                });
            }

            return <> {ingredientText} { specialOffer ? 
                <ul>
                    <li>
                        {specialOffer.title} ({this.Capitalize(specialOffer.type)}) <br />
                        {specialOffer.text}
                    </li>
                </ul>
                : ''} 
            </>;
        }
    }

    Capitalize(str){
        if (!str) {
            return;
        }

        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    render(){
        let myComponent;
        if(this.props.data.recipe) {
            myComponent =
            <Modal 
                show={this.state.showHide} 
                onHide={() => this.handleModal()}
                backdrop="static"
                >
                <Modal.Header closeButton onClick={() => this.handleModal()}>
                <Modal.Title>{this.handleModalTitle()}</Modal.Title>
                </Modal.Header>
                <Modal.Body>    
                    <Card>
                        <Card.Img variant="top" src="https://via.placeholder.com/500x250" />
                        <Card.Body>
                            <Card.Text className="text-center">
                                <h5>{this.props.data.recipe.description}</h5>
                                <span>Preparation Time:{' '} <Badge variant="secondary">{this.props.data.recipe.prepTime} mins</Badge></span> <br/>
                                <span>Servings:{' '} <Badge variant="secondary">{this.props.data.recipe.servings}</Badge></span>
                            </Card.Text>
                            <Accordion>
                                <Card>
                                    <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        Ingredients
                                    </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>
                                            <ul>
                                                { this.props.data.recipe.ingredients.length !== 0 ? 
                                                this.props.data.recipe.ingredients.map(ingredient => (
                                                    <li>
                                                        { this.displayIngredient(ingredient) }
                                                    </li>
                                                ))
                                                :
                                                <li></li>
                                                }
                                            </ul>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                        Directions
                                    </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body>
                                            <ul>
                                                { this.props.data.recipe.directions.length !== 0 ? 
                                                this.props.data.recipe.directions.map(direction => (
                                                    <li>
                                                        {direction.instructions} {direction.optional ? '(Optional)' : ''}
                                                    </li>
                                                ))
                                                :
                                                <li></li>
                                                }
                                            </ul>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Card.Body>
                        <Card.Footer className="text-muted text-right"><Moment fromNow>
                                 {this.props.data.recipe.postDate}</Moment></Card.Footer>
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => this.handleModal()}>
                    Close
                </Button>
                { this.props.data.action !== 'view' &&
                    <Button variant="primary" onClick={() => this.handleSubmit()}>
                        { this.Capitalize(this.props.data.action) }
                    </Button>
                }
                </Modal.Footer>
            </Modal>
        } else {
            myComponent = null
        }
        return (
            <div>
                {myComponent}
            </div>
        )
    }
    
}

export default RecipeModal;