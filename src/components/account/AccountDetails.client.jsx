import {Image, Seo} from '@shopify/hydrogen';
import {useState} from 'react';

import {Text} from '~/components';
import {Modal} from '../index';
import {AccountDetailsEdit} from './AccountDetailsEdit.client';
import {AccountProfileEdit} from './AccountProfileEdit.client';

export function AccountDetails({firstName, lastName, phone, email, profile}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const close = () => setIsEditing(false);
  const closeProfile = () => setIsEditingProfile(false);

  return (
    <>
      {isEditing ? (
        <Modal close={close}>
          <Seo type="noindex" data={{title: 'Account details'}} />
          <AccountDetailsEdit
            firstName={firstName}
            lastName={lastName}
            phone={phone}
            email={email}
            close={close}
          />
        </Modal>
      ) : null}
      {isEditingProfile ? (
        <Modal close={closeProfile}>
          <Seo type="noindex" data={{title: 'Profile details'}} />
          <AccountProfileEdit
            profileId={profile.sys.id}
            hair={profile.hair}
            skin={profile.skin}
            tone={profile.tone}
            lip={profile.lip}
            close={closeProfile}
          />
        </Modal>
      ) : null}
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h3 className="font-bold text-lead">Account Details</h3>
        <div className="lg:p-8 p-6 border border-gray-200 rounded">
          <div className="flex">
            <h3 className="font-bold text-base flex-1">Profile & Security</h3>
            <button
              className="underline text-sm font-normal"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>
          <div className="mt-4 text-sm text-primary/50">Name</div>
          <p className="mt-1">
            {firstName || lastName
              ? (firstName ? firstName + ' ' : '') + lastName
              : 'Add name'}{' '}
          </p>

          <div className="mt-4 text-sm text-primary/50">Contact</div>
          <p className="mt-1">{phone ?? 'Add mobile'}</p>

          <div className="mt-4 text-sm text-primary/50">Email address</div>
          <p className="mt-1">{email}</p>

          <div className="mt-4 text-sm text-primary/50">Password</div>
          <p className="mt-1">**************</p>
        </div>
        <div className="lg:p-8 p-6 border border-gray-200 rounded">
          <div className="flex">
            <h3 className="font-bold text-base flex-1">Profile details</h3>
            <button
              className="underline text-sm font-normal"
              onClick={() => setIsEditingProfile(true)}
            >
              Edit
            </button>
          </div>
          <div className="mt-4">
            {profile ? <Profile data={profile} /> : <EmptyProfile />}
          </div>
        </div>
      </div>
    </>
  );
}

function EmptyProfile() {
  return (
    <div>
      <Text className="mb-1" size="fine" width="narrow" as="p">
        You haven&apos;t your profile yet.
      </Text>
    </div>
  );
}

function Profile({data}) {
  return (
    <>
      <div className="mt-4 text-sm text-primary/50">Profile Image</div>
      {data.image && (
        <div className="mt-1 w-16 h-16">
          <Image data={data.image} />
        </div>
      )}

      <div className="mt-4 text-sm text-primary/50">Banner Image</div>
      {data.banner && (
        <div className="mt-1 w-32">
          <Image
            className="object-cover w-full rounded-lg"
            data={data.banner}
          />
        </div>
      )}

      <div className="mt-4 text-sm text-primary/50">Hair Type</div>
      <p className="mt-1">{data.hair}</p>
      <div className="mt-4 text-sm text-primary/50">Skin Type</div>
      <p className="mt-1">{data.skin}</p>
      <div className="mt-4 text-sm text-primary/50">Tone Type</div>
      <p className="mt-1">{data.tone}</p>
      <div className="mt-4 text-sm text-primary/50">Lip Type</div>
      <p className="mt-1">{data.lip}</p>
    </>
  );
}
