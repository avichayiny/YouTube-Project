function SearchButton() {
    return (
        <div className="searchButton">
        <div className="row justify-content-center ">
            <div className="col-md-6 d-flex justify-content-center">
                <input className="form-control me-2" id="exampleFormControlInput1" placeholder="Search"></input>
                <button className="btn btn-danger mt-1">Search</button>
            </div>
        </div>
        </div>

    );
}
export default SearchButton;