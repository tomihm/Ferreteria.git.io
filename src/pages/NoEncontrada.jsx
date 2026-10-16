import { Link } from 'react-router-dom';

function NoEncontrada() {
    return (
        <section className="py-5">
            <div className="container">
                <h1 className="h3">Esta página no existe</h1>
                <p>Puede que el link esté mal escrito o que la página se haya movido.</p>
                <Link to="/" className="btn btn-primary">Volver al inicio</Link>
            </div>
        </section>
    );
}

export default NoEncontrada;
