import {Button} from '~/components';
import {deleteVideoEntry} from '~/lib/contentful/assetService';
import {useNavigate, useServerProps} from '@shopify/hydrogen';

export function VideoDeleteButton({id}) {
  // const {setServerProps} = useServerProps();
  const navigate = useNavigate();

  return (
    <Button
      onClick={async (event) => {
        event.preventDefault();
        await deleteVideoEntry(id);
        // setServerProps('isDeleted', true);
        navigate('/account/video', {replace: true});
      }}
    >
      Delete
    </Button>
  );
}
