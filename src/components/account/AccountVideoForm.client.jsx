import {useMemo, useState} from 'react';
import {gql} from '@shopify/hydrogen';
import {FilePond, registerPlugin} from 'react-filepond';
import {useRenderServerComponents} from '~/lib/utils';

import {Button, Text} from '~/components';
import {getInputStyleClasses} from '../../lib/styleUtils';

import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

registerPlugin(FilePondPluginFileValidateType);

export function AccountVideoForm({products, customer, close}) {
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState(null);
  const [tags, setTags] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const userId = customer.id;

  // Necessary for edits to show up on the main page
  const renderServerComponents = useRenderServerComponents();

  async function onSubmit(event) {
    event.preventDefault();

    setSaving(true);

    console.log(title, description, files, tags, relatedProducts, userId);

    // const {data, errors} = await useContentfulQuery({
    //   query: VIDEO_UPDATE_MUTATION,
    //   variables: {
    //     id: video?.sys.id,
    //     title,
    //     description,
    //     files,
    //     tags,
    //     products,
    //     userId,
    //   },
    // });

    setSaving(false);

    // if (response.error) {
    //   setSubmitError(response.error);
    //   return;
    // }

    renderServerComponents();
    close();
  }

  return (
    <>
      <Text className="mt-4 mb-6" as="h3" size="lead">
        Add video
      </Text>
      <div className="max-w-lg">
        <form noValidate onSubmit={onSubmit}>
          {submitError && (
            <div className="flex items-center justify-center mb-6 bg-red-100 rounded">
              <p className="m-4 text-sm text-red-900">{submitError}</p>
            </div>
          )}
          <div className="mt-3">
            <input
              className={getInputStyleClasses()}
              id="title"
              name="title"
              required
              type="text"
              placeholder="Title"
              aria-label="Title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={getInputStyleClasses()}
              id="description"
              name="description"
              required
              type="text"
              placeholder="Description"
              aria-label="Description"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={getInputStyleClasses()}
              id="tags"
              name="tags"
              type="text"
              placeholder="Tags (e.g. #kolwave, #face, #cosmetics)"
              aria-label="Tags"
              value={tags}
              onChange={(event) => {
                setTags(event.target.value.split(',').map((tag) => tag.trim()));
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className={getInputStyleClasses()}
              id="products"
              name="products"
              type="text"
              required
              placeholder="Products"
              aria-label="Products"
              value={relatedProducts}
              onChange={(event) => {
                setRelatedProducts(
                  event.target.value.split(',').map((tag) => tag.trim()),
                );
              }}
            />
          </div>
          <div className="mt-3">
            <FilePond
              files={files}
              onupdatefiles={setFiles}
              maxFiles={1}
              name="files"
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              acceptedFileTypes={['video/quicktime', 'video/mp4']}
              credits={false}
            />
          </div>
          <div className="mt-8">
            <Button
              className="w-full rounded focus:shadow-outline"
              type="submit"
              variant="primary"
              disabled={saving}
            >
              Save
            </Button>
          </div>
          <div>
            <Button
              className="w-full mt-2 rounded focus:shadow-outline"
              variant="secondary"
              onClick={close}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
