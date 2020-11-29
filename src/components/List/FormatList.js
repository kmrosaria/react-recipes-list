import React, {Component} from 'react';
import { Button } from 'react-bootstrap';

class FormatList extends Component {
    constructor(props) {
        super(props);

        console.log(props);
    }

    showModal = (type, data) => {
        this.props.handleModal(type, data);
    }

    render() {
        return (
            <tr>
                <td key={"title-" + this.props.data.uuid}>{this.props.data.title}</td>
                <td key={"desc-" + this.props.data.uuid}>{this.props.data.description}</td>
                <td key={"servings-" + this.props.data.uuid}>{this.props.data.servings}</td>
                <td key={"action-" + this.props.data.uuid}>
                    <Button variant="info">Edit</Button>{' '}
                    <Button variant="warning">Delete</Button>{' '}
                </td>
            </tr>
        )
    }
}

export default FormatList;