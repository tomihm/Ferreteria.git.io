import { Link } from 'react-router-dom';

function Main() {
    return(
        <main>
      <section className="hero">
        <div className="contenedor">
          <h1>Todo para tu obra, en un solo lugar</h1>
          <p>
            22 años en La Serena abasteciendo a contratistas y hogares. Mira el
            stock disponible y arma tu pedido sin tener que llamar por teléfono.
          </p>
          <div className="hero__botones">
            <Link to="/catalogo" className="btn btn--primario">
              Ver catálogo
            </Link>
            <Link to="/login" className="btn btn--borde">
              Entrar a mi cuenta
            </Link>
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <h2 className="seccion__titulo">Qué vendemos</h2>
          <p className="seccion__subtitulo">Más de 800 referencias en bodega</p>
          <div className="grid grid--3">
            <Link to="/catalogo#construccion" className="categoria-card">
              <div className="icono">🧱</div>
              <h3>Materiales de Construcción</h3>
              <p>Cemento, arena, ladrillo, fierro y tableros</p>
            </Link>
            <Link to="/catalogo#herramientas" className="categoria-card">
              <div className="icono">🔌</div>
              <h3>Herramientas Eléctricas</h3>
              <p>Taladros, esmeriles, sierras y lijadoras</p>
            </Link>
            <Link to="/catalogo#manuales" className="categoria-card">
              <div className="icono">🔨</div>
              <h3>Herramientas Manuales</h3>
              <p>Martillos, alicates, niveles y huinchas</p>
            </Link>
            <Link to="/catalogo#gasfiteria" className="categoria-card">
              <div className="icono">🚿</div>
              <h3>Gasfitería</h3>
              <p>Tubos PVC, fittings y llaves de paso</p>
            </Link>
            <Link to="/catalogo#electricidad" className="categoria-card">
              <div className="icono">💡</div>
              <h3>Electricidad</h3>
              <p>Cables, automáticos, enchufes y ampolletas</p>
            </Link>
            <Link to="/catalogo#general" className="categoria-card">
              <div className="icono">🔩</div>
              <h3>Ferretería General</h3>
              <p>Tornillos, siliconas y seguridad</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="seccion seccion--blanca">
        <div className="contenedor">
          <h2 className="seccion__titulo">Los más pedidos</h2>
          <p className="seccion__subtitulo">
            Lo que se llevan nuestros maestros cada semana
          </p>

          <div className="grid grid--4">
            <article className="tarjeta">
              <div className="producto__img">🧱</div>
              <div className="tarjeta__cuerpo">
                <p className="producto__codigo">CON-001</p>
                <h3 className="producto__nombre">Saco de Cemento Melón 25kg</h3>
                <p className="producto__marca">Melón</p>
                <p className="producto__precio">$5.490</p>
                <span className="badge badge--stock">Disponible: 120</span>
                <div className="producto__acciones">
                  <Link to="/producto" className="btn btn--primario btn--bloque">
                    Ver producto
                  </Link>
                </div>
              </div>
            </article>

            <article className="tarjeta">
              <div className="producto__img">🔩</div>
              <div className="tarjeta__cuerpo">
                <p className="producto__codigo">HER-001</p>
                <h3 className="producto__nombre">Taladro Percutor 750W</h3>
                <p className="producto__marca">Bosch</p>
                <p className="producto__precio">$54.990</p>
                <span className="badge badge--stock">Disponible: 14</span>
                <div className="producto__acciones">
                  <Link to="/producto" className="btn btn--primario btn--bloque">
                    Ver producto
                  </Link>
                </div>
              </div>
            </article>

            <article className="tarjeta">
              <div className="producto__img">🔨</div>
              <div className="tarjeta__cuerpo">
                <p className="producto__codigo">MAN-001</p>
                <h3 className="producto__nombre">Martillo Carpintero 16oz</h3>
                <p className="producto__marca">Bahco</p>
                <p className="producto__precio">$7.990</p>
                <span className="badge badge--stock">Disponible: 45</span>
                <div className="producto__acciones">
                  <Link to="/producto" className="btn btn--primario btn--bloque">
                    Ver producto
                  </Link>
                </div>
              </div>
            </article>

            <article className="tarjeta">
              <div className="producto__img">💡</div>
              <div className="tarjeta__cuerpo">
                <p className="producto__codigo">ELE-003</p>
                <h3 className="producto__nombre">Ampolleta LED 12W E27</h3>
                <p className="producto__marca">Philips</p>
                <p className="producto__precio">$2.490</p>
                <span className="badge badge--stock">Disponible: 150</span>
                <div className="producto__acciones">
                  <Link to="/producto" className="btn btn--primario btn--bloque">
                    Ver producto
                  </Link>
                </div>
              </div>
            </article>
          </div>

          <div className="texto-centro mt-3">
            <Link to="/catalogo" className="btn btn--primario">
              Ver todo el catálogo
            </Link>
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <h2 className="seccion__titulo">Cómo funciona comprar aquí</h2>
          <p className="seccion__subtitulo">Tres pasos entre tu obra y el material</p>
          <div className="grid grid--3 mt-3">
            <article className="categoria-card">
              <div className="icono">📦</div>
              <h3>Revisa el stock</h3>
              <p>
                Cada producto muestra las unidades que hay en bodega ahora
                mismo. Si dice disponible, está.
              </p>
            </article>
            <article className="categoria-card">
              <div className="icono">🛒</div>
              <h3>Arma tu pedido</h3>
              <p>
                Agrega lo que necesites al carrito y elige entre retirar en el
                mesón o pedir despacho.
              </p>
            </article>
            <article className="categoria-card">
              <div className="icono">📄</div>
              <h3>Paga como te acomode</h3>
              <p>
                Al contado, o a fin de mes si tienes cuenta corriente
                habilitada como contratista.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="seccion seccion--blanca">
        <div className="contenedor">
          <div className="grid grid--2" style={{ alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.7rem', marginBottom: '12px' }}>
                ¿Despachamos hasta tu obra?
              </h2>
              <p style={{ color: 'var(--gris-700)', marginBottom: '18px' }}>
                Cubrimos 12 km a la redonda desde Av. Balmaceda, lo que incluye La
                Serena y buena parte de Coquimbo. Revisa tu dirección en el
                mapa antes de hacer el pedido.
              </p>
              <Link to="/contacto" className="btn btn--primario">
                Ver mapa de cobertura
              </Link>
            </div>
            <div
              className="categoria-card"
              style={{ borderTopColor: 'var(--gris-900)' }}
            >
              <h3>Horario de atención</h3>
              <p style={{ marginTop: '10px' }}>
                Lunes a viernes · 8:30 a 19:00
                <br />
                Sábado · 9:00 a 14:00
                <br />
                Domingo · cerrado
              </p>
              <p className="mt-2">
                <strong>+56 51 221 4455</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
    )
}
export default Main