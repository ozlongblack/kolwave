import {useState} from 'react';

import {Text, Button} from '~/components';
import {useRenderServerComponents} from '~/lib/utils';
import {getInputStyleClasses} from '../../lib/styleUtils';

const hairTypes = ['straight', 'wavy', 'curl'];
const skinTypes = ['normal', 'sensitive'];
const toneTypes = ['light', 'normal', 'dark'];
const lipTypes = ['light', 'normal', 'dark'];

export function AccountProfileEdit({
  hair: _hair = '',
  skin: _skin = '',
  tone: _tone = '',
  lip: _lip = '',
  close,
}) {
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState(null);
  const [banner, setBanner] = useState(null);
  const [hair, setHair] = useState(_hair);
  const [skin, setSkin] = useState(_skin);
  const [tone, setTone] = useState(_tone);
  const [lip, setLip] = useState(_lip);
  const [submitError, setSubmitError] = useState(null);

  // Necessary for edits to show up on the main page
  const renderServerComponents = useRenderServerComponents();

  async function onSubmit(event) {
    event.preventDefault();

    setSaving(true);

    const accountUpdateResponse = await callAccountUpdateApi({
      image,
      banner,
      hair,
      skin,
      tone,
      lip,
    });

    setSaving(false);

    if (accountUpdateResponse.error) {
      setSubmitError(accountUpdateResponse.error);
      return;
    }

    renderServerComponents();
    close();
  }

  return (
    <>
      <Text className="mt-4 mb-6" as="h3" size="lead">
        Update your profile
      </Text>
      <form noValidate onSubmit={onSubmit}>
        {submitError && (
          <div className="flex items-center justify-center mb-6 bg-red-100 rounded">
            <p className="m-4 text-sm text-red-900">{submitError}</p>
          </div>
        )}
        <div className="mt-4 text-sm text-primary/50">Profile Image</div>
        <div className="mt-1">
          <input
            className={getInputStyleClasses()}
            id="image"
            name="image"
            type="file"
            aria-label="Profile image"
            accept="image/png, image/jpeg"
            onChange={(event) => {
              setImage(event.target.files[0]);
            }}
          />
        </div>
        <div className="mt-4 text-sm text-primary/50">Banner Image</div>
        <div className="mt-1">
          <input
            className={getInputStyleClasses()}
            id="banner"
            name="banner"
            type="file"
            aria-label="Profile banner"
            accept="image/png, image/jpeg"
            onChange={(event) => {
              setBanner(event.target.files[0]);
            }}
          />
        </div>
        <div className="mt-4 text-sm text-primary/50">Hair Type</div>
        <div className="mt-1">
          {hairTypes.map((value) => {
            return (
              <Text as="label" key={value} htmlFor={`hair-${value}`}>
                <input
                  className="sr-only"
                  type="radio"
                  id={`hair-${value}`}
                  name="hair"
                  value={value}
                  checked={hair === value}
                  onChange={() => {
                    setHair(value);
                  }}
                />
                <div
                  className={`leading-none py-1 border-b-[1.5px] cursor-pointer transition-all duration-200 ${
                    hair === value ? 'border-primary/50' : 'border-primary/0'
                  }`}
                >
                  {value}
                </div>
              </Text>
            );
          })}
        </div>
        <div className="mt-4 text-sm text-primary/50">Skin Type</div>
        <div className="mt-1">
          {skinTypes.map((value) => {
            return (
              <Text as="label" key={value} htmlFor={`skin-${value}`}>
                <input
                  className="sr-only"
                  type="radio"
                  id={`skin-${value}`}
                  name="skin"
                  value={value}
                  checked={skin === value}
                  onChange={() => {
                    setSkin(value);
                  }}
                />
                <div
                  className={`leading-none py-1 border-b-[1.5px] cursor-pointer transition-all duration-200 ${
                    skin === value ? 'border-primary/50' : 'border-primary/0'
                  }`}
                >
                  {value}
                </div>
              </Text>
            );
          })}
        </div>
        <div className="mt-4 text-sm text-primary/50">Tone Type</div>
        <div className="mt-1">
          {toneTypes.map((value) => {
            return (
              <Text as="label" key={value} htmlFor={`tone-${value}`}>
                <input
                  className="sr-only"
                  type="radio"
                  id={`tone-${value}`}
                  name="tone"
                  value={value}
                  checked={tone === value}
                  onChange={() => {
                    setTone(value);
                  }}
                />
                <div
                  className={`leading-none py-1 border-b-[1.5px] cursor-pointer transition-all duration-200 ${
                    tone === value ? 'border-primary/50' : 'border-primary/0'
                  }`}
                >
                  {value}
                </div>
              </Text>
            );
          })}
        </div>
        <div className="mt-4 text-sm text-primary/50">Lip Type</div>
        <div className="mt-1">
          {lipTypes.map((value) => {
            return (
              <Text as="label" key={value} htmlFor={`lip-${value}`}>
                <input
                  className="sr-only"
                  type="radio"
                  id={`lip-${value}`}
                  name="lip"
                  value={value}
                  checked={lip === value}
                  onChange={() => {
                    setLip(value);
                  }}
                />
                <div
                  className={`leading-none py-1 border-b-[1.5px] cursor-pointer transition-all duration-200 ${
                    lip === value ? 'border-primary/50' : 'border-primary/0'
                  }`}
                >
                  {value}
                </div>
              </Text>
            );
          })}
        </div>

        <div className="mt-6">
          <Button
            className="text-sm mb-2"
            variant="primary"
            width="full"
            type="submit"
            disabled={saving}
          >
            Save
          </Button>
        </div>
        <div className="mb-4">
          <Button
            type="button"
            className="text-sm"
            variant="secondary"
            width="full"
            onClick={close}
          >
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
}

export async function callAccountUpdateApi({
  image,
  banner,
  hair,
  skin,
  tone,
  lip,
}) {
  try {
    const res = await fetch(`/account`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image,
        banner,
        hair,
        skin,
        tone,
        lip,
      }),
    });
    if (res.ok) {
      return {};
    } else {
      return res.json();
    }
  } catch (_e) {
    return {
      error: 'Error saving account. Please try again.',
    };
  }
}
