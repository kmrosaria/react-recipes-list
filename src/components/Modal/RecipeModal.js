import React from 'react'
import { Button, Modal, Accordion, Badge, Card, Form, Col } from 'react-bootstrap'
import Moment from 'react-moment';


class RecipeModal extends React.PureComponent{

    constructor(props){
        super(props);

        this.state = {
            showHide : false,
            submitBtnText : 'Save'
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentWillReceiveProps(props){
        if (!this.state.showHide && props.data.action) {
            this.handleModal();
        }
    }

    handleModal() {
        this.setState({ showHide: !this.state.showHide});
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);

        // NOTE: Not finished (no ingredients and directions)
        let newRecipe = {
            'uuid': this.generateUUID(),
            'title': data.get('title'),
            'description': data.get('description'),
            'servings': data.get('servings'),
            'prepTime': data.get('prepTime'),
            'cookTime': data.get('cookTime'),
            'images': {},
            'postDate': Date.now(),
            'editDate': Date.now(),
            'ingredients': {},
            'directions': {}
        };

        fetch('http://localhost:3001/recipes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newRecipe)
        });
    }

    submitForm() {
        this.handleSubmit();
    }

    handleModalTitle() {
        let title = this.Capitalize(this.props.data.action);

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
                : null
            } </>;
        }
    }

    checkIfEmpty(obj) {
       return Object.keys(obj).length !== 0;
    }

    Capitalize(str){
        if (!str) {
            return;
        }

        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    generateUUID() {
        var d = new Date().getTime();
        var d2 = (performance && performance.now && (performance.now()*1000)) || 0;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16;
            if(d > 0){
                r = (d + r)%16 | 0;
                d = Math.floor(d/16);
            } else {
                r = (d2 + r)%16 | 0;
                d2 = Math.floor(d2/16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    render(){
        let myComponent;

        if(this.props.data.action) {
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
                    { this.props.data.action !== 'add' ? (
                    <Card>
                        <Card.Img variant="top" src="https://via.placeholder.com/500x250" />
                        <Card.Body>
                            <Card.Text className="text-center">
                                <h5>{this.props.data.recipe.description}</h5>
                                <span>Preparation Time:{' '} <Badge variant="secondary">{this.props.data.recipe.prepTime} mins</Badge></span> <br/>
                                <span>Servings:{' '} <Badge variant="secondary">{this.props.data.recipe.servings}</Badge></span>
                            </Card.Text>
                            <Accordion>
                                { this.checkIfEmpty(this.props.data.recipe.ingredients) ? (
                                    <Card>
                                        <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                            Ingredients
                                        </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>
                                                <ul>
                                                    { this.props.data.recipe.ingredients.map(ingredient => (
                                                        <li>
                                                            { this.displayIngredient(ingredient) }
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                    ) : (
                                        null
                                    )
                                }
                                
                                { this.checkIfEmpty(this.props.data.recipe.directions) ? (
                                    <Card>
                                        <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                            Directions
                                        </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="1">
                                            <Card.Body>
                                                <ul>
                                                    { this.props.data.recipe.directions.map(direction => (
                                                        <li>
                                                            {direction.instructions} {direction.optional ? '(Optional)' : ''}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                    ) : (
                                        null
                                    )
                                }
                                
                            </Accordion>
                        </Card.Body>
                        <Card.Footer className="text-muted text-right">
                            <Moment fromNow>{this.props.data.recipe.postDate}</Moment>
                        </Card.Footer>
                    </Card>
                    ) : (
                        <Form onSubmit={this.handleSubmit} id="frmAddRecipe">
                            <Form.Group controlId="formRecipeTitle">
                                <Form.Label>Recipe</Form.Label>
                                <Form.Control type="text" name="title" placeholder="Enter Recipe" />
                            </Form.Group>
                            <Form.Group controlId="formRecipeDesc">
                                <Form.Label>Description</Form.Label>
                                <Form.Control type="text" name="description" placeholder="Enter Description" />
                            </Form.Group>
                            <Form.Row>
                                <Col>
                                    <Form.Group controlId="formServing">
                                        <Form.Label>Servings</Form.Label>
                                        <Form.Control type="number" name="servings" placeholder="Enter Servings" />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formPrepTime">
                                        <Form.Label>Prep Time</Form.Label>
                                        <Form.Control type="number" name="prepTime" placeholder="Enter Prep Time" />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="cookTime">
                                        <Form.Label>Cook Time</Form.Label>
                                        <Form.Control type="number" name="cookTime" placeholder="Enter Cook Time" />
                                    </Form.Group>
                                </Col>
                            </Form.Row>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => this.handleModal()}>
                    Close
                </Button>
                { this.props.data.action !== 'view' &&
                    <Button variant="primary" type="submit" form="frmAddRecipe">
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