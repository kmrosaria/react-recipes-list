import React, { useState, useEffect } from "react";
import { Button, Table } from 'react-bootstrap';
import RecipeModal from '../Modal/RecipeModal';

function List() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [specials, setSpecials] = useState([]);
    const [modalData, setModalData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3001/recipes")
        .then(res => res.json())
        .then(
            (result) => {
                setIsLoaded(true);
                setRecipes(result);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )

        fetch("http://localhost:3001/specials")
        .then(res => res.json())
        .then(
            (result) => {
                setSpecials(result);
            }
        )
    }, [])
  
    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div className="container">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <td key="recipe-title">
                                <a href="#" className="" onClick="">Title</a>
                            </td>
                            <td key="recipes-desc">
                                <a href="#" className="" onClick="">Description</a>
                            </td>
                            <td key="recipes-servings">
                                <a href="#" className="" onClick="">Servings</a>
                            </td>
                            {/* <td key="recipes-action">
                                Action
                            </td> */}
                        </tr>
                    </thead>
                    <tbody>
                        { recipes.length !== 0 ? 
                        recipes.map(recipe => (
                            <tr onClick={() => setModalData({recipe, specials, action:'view'})}>
                                <td key={"title-" + recipe.uuid}>{recipe.title}</td>
                                <td key={"desc-" + recipe.uuid}>{recipe.description}</td>
                                <td key={"servings-" + recipe.uuid}>{recipe.servings}</td>
                                {/* <td key={"action-" + recipe.uuid}>
                                    <Button variant="primary" onClick={() => setModalData({recipe, specials, action:'edit'})}>Edit</Button>{' '}
                                    <Button variant="warning" onClick={() => setModalData({recipe, specials, action:'delete'})}>Delete</Button>{' '}
                                </td> */}
                            </tr>
                        ))
                        :
                        <tr className="no-recipes-available"><td colSpan='3'></td></tr>
                        }
                    </tbody>
                </Table>

                <RecipeModal data={modalData} />
            </div>
        );
        }
    }

  export default List;