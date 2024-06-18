import Nav from "../components/Nav";
function AdminPage (){


    return (
      < >
        <Nav/>
        <div className='admin-page'>
            <div>
                <h1>Zamowienia</h1>
                <div className="admin-zamowienia">
                    <div>
                        <h2>Przychodzące</h2>
                        <div className="zamowienie zamowienie-przychodzace">

                        </div>
                    </div>
                    <div>
                        <h2>Przyjęte</h2>
                        <div className="zamowienie zamowienie-przyjete">

                        </div>
                    </div>
                    <div>
                        <h2>Wykonane</h2>
                        <div className="zamowienie zamowienie-wykonane">

                        </div>
                    </div>
                    <div>
                        <h2>Odrzucone</h2>
                        <div className="zamowienie zamowienie-odrzucone">

                        </div>
                    </div>
                </div>
            </div>
        </div>
          </>
    )
}

export default AdminPage