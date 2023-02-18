import {Button} from '~/components';
import {deleteVideoEntry} from '~/lib/contentful/assetService';

export function VideoDeleteButton({id}) {
  return (
    <Button
      onClick={() => {
        deleteVideoEntry(id);
      }}
    >
      Delete
    </Button>
  );
}
