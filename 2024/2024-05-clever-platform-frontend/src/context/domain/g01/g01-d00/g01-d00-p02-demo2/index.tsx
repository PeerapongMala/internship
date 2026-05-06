import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import StoreGame from '@global/store/game';
import ConfigJson from './config/index.json';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(true);
    StoreGame.MethodGet().SceneManagerSceneSet(ConfigJson.id);
  }, []); // Make sure to provide an appropriate dependency array

  // const {
  //   register,
  //   handleSubmit,
  //   setError,
  //   formState: { errors, isDirty, isValid },
  // } = useForm({ resolver: yupResolver(schema), mode: 'onChange' });

  // const { setLoading } = GetMethodStoreGlobal();
  // const { setUserData } = GetMethodStoreGlobalPersist();

  // const navigate = useNavigate();

  // const firebaseLogin = async (sEmail: string, sPassword: string) => {
  //   setLoading(true);
  //   await HelperTime.WaitForMilliSecond(300);
  //   setLoading(false);

  //   if (sEmail != testUser) {
  //     setError('username', {
  //       type: 'custom',
  //       message: 'validate.userNotFound',
  //     });
  //     return;
  //   }

  //   if (sPassword == 'global') {
  //     setError('global', {
  //       type: 'custom',
  //       message: 'validate.networkRequestFailed',
  //     });
  //     return;
  //   }

  //   if (sPassword != testPassword) {
  //     setError('password', {
  //       type: 'custom',
  //       message: 'validate.passwordWrong',
  //     });
  //     return;
  //   }

  //   console.log('sign in');
  //   setUserData({});
  //   navigate('/user/dashboard');
  // };

  // const onSubmit = async (data: any) => {
  //   await firebaseLogin(data.username, data.password);
  // };

  // const [isShowPassword, setIsShowPassword] = useState(false);
  // const onClickShowPassword = () => {
  //   setIsShowPassword((state) => !state);
  // };

  return (
    <div className="uh-h-screen text-white">
      Test i18n : {t('test')} <br />
      Hello World
    </div>
  );
};

export default DomainJSX;
