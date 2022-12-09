
import Application from "./src/Application.js";

import './node_modules/jquery/dist/jquery.js';
import './node_modules/bootstrap/dist/js/bootstrap.js';
import './node_modules/pdfmake/build/pdfmake.js';
import './node_modules/pace-js/pace.js'
// import SharePointApi from './src/Libraries/SharePointApi/src/SharePointApi.js';

// import * as Settings from './app.Settings.js';
// import CreateElement from './src/Actions/Element.Create.js';
import Component from './src/Classes/Component.js';
import Form from './src/Classes/Form.js';
// import Album from "./src/Albums/Album.js";
import Record from "./src/Albums/Record.js";
// import Render from './app.Render.js';

// const { pathname } = location;
const App = new Application();

export default App;

async function init(){

    console.info(App);

    // const album = new Record({
    //     title: 'Logans Favorites', 
    //     genre: 'Country'
    // });
    // console.info(album)

    const component = new Component({
        tag: 'div',
        classList: 'w-100',
        parent: document.body,
        innerHTML: /*html*/`
        <div tab-header class="jumbotron jumbotron-fluid border w-100">
            <div class="px-5">
                <div class="d-inline-flex">
                    <h1 class="display-5 text-primaryColor">{Title}</h1>
                </div>
                <p class="lead text-primaryColor">Description: {Description || 'N/A'}</p>
                <div>{SharePointVersions[version]} ({AllProperties?.vti_x005f_extenderversion || '00.0.0.0000'})</div>
                <div>URL: {Url}</div>
                <div>Lists: {Lists?.results.length || 0}</div>
                <div>Document Libraries: {Folders?.results.length || 0}</div>
                <div>SubSites: {WebInfos?.results.length || 0}</div>
                <div class="mt-1 row admin-links"></div>
            </div>
        </div>`
    }).render();

    const form = new Form({
        classList: 'row g-3 needs-validation',
        parent: document.body,
        innerHTML: /*html*/`
        <div class="col-md-6">
            <label for="inputEmail4" class="form-label">Email</label>
            <input name="Email" type="email" class="form-control" id="inputEmail4" value="john.doe@mail.com" required>
        </div>
        <div class="col-md-6">
            <label for="inputEmail4" class="form-label">CurrentDate</label>
            <!-- <input type="email" class="form-control" id="inputEmail4"> -->
            <input class="form-control" type="date" id="start" name="CurrentDate"
                value="2018-07-22"
                min="2018-01-01" max="2018-12-31">
        </div>
        <div class="col-md-6">
            <label for="inputPassword4" class="form-label">Password</label>
            <input type="password" class="form-control" id="inputPassword4">
        </div>
        <div class="col-12">
            <label for="inputAddress" class="form-label">Address</label>
            <input name="Address" type="text" class="form-control" id="inputAddress" placeholder="1234 Main St" value="1234 Main St">
        </div>
        <div class="col-12">
            <label for="inputAddress2" class="form-label">Address 2</label>
            <input name="Address2" type="text" class="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor" value="Apartment, studio, or floor">
        </div>
        <div class="col-md-6">
            <label for="inputCity" class="form-label">City</label>
            <input type="text" class="form-control" id="inputCity" required>
        </div>
        <div class="col-md-4">
            <label for="inputState" class="form-label">State</label>
            <select id="inputState" class="form-select">
            <option selected>Choose...</option>
            <option>...</option>
            </select>
        </div>
        <div class="col-md-2">
            <label for="inputZip" class="form-label">Zip</label>
            <input type="text" class="form-control" id="inputZip" name="Zip" value="12345">
        </div>
        <div class="col-12">
            <div class="form-check">
            <input name="checkmeout" class="form-check-input" type="checkbox" id="gridCheck">
            <label class="form-check-label" for="gridCheck">
                Check me out
            </label>
            </div>
        </div>
        <div class="col-12">
            <button type="submit" class="btn btn-primary">Sign in</button>
        </div>`,
    }).render();

    console.info({
        component,
        form,
    });

    window.form = form;

    console.info(new Component(document.body));


}

window.onload = init;