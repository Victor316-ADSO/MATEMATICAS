import useAuth from '../../hooks/useAuth';
import Principal from './Principal';

/**
 * Remonta Principal al cambiar de usuario para no mezclar respuestas en memoria.
 */
const PrincipalPage = () => {
  const { user } = useAuth();
  const userKey =
    user?.iden_pers != null
      ? String(user.iden_pers)
      : user?.identificacion != null
        ? String(user.identificacion)
        : 'anon';

  return <Principal key={userKey} />;
};

export default PrincipalPage;
