'use client';

import { useEffect, useRef, useState, useActionState } from 'react';
import Image from 'next/image';
import { useFormStatus } from 'react-dom';
import { getMotivation, moderateAndPost, type MotivationState, type PostState } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Heart, Loader2, MessageSquare, Send, Users } from 'lucide-react';
import Link from 'next/link';

type Post = {
  author: string;
  avatar: string;
  content: string;
};

function PostSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
    </Button>
  );
}

function MotivationSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Support"}
    </Button>
  );
}

const anonymousAvatar = PlaceHolderImages.find(p => p.id === 'anonymous-avatar');

export default function CommunityPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const postFormRef = useRef<HTMLFormElement>(null);
  const motivationFormRef = useRef<HTMLFormElement>(null);

  // Use a static 0 for initial timestamp to avoid hydration mismatch
  const initialPostState: PostState = { message: undefined, post: undefined, timestamp: 0 };
  const [postState, postDispatch] = useActionState(moderateAndPost, initialPostState);

  const initialMotivationState: MotivationState = { message: undefined, data: undefined };
  const [motivationState, motivationDispatch] = useActionState(getMotivation, initialMotivationState);

  useEffect(() => {
    if (postState.message) {
      toast({ 
        title: 'Forum Update', 
        description: postState.message, 
        variant: postState.post ? 'default' : 'destructive' 
      });
    }
    if (postState.post) {
      setPosts(prevPosts => [postState.post!, ...prevPosts]);
      postFormRef.current?.reset();
    }
  }, [postState, toast]);

  useEffect(() => {
    if (motivationState.message) {
        toast({ title: 'Mood Support', description: motivationState.message, variant: 'destructive'});
    }
    if (motivationState.data) {
        motivationFormRef.current?.reset();
    }
  }, [motivationState, toast]);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-12">
        <Users className="w-16 h-16 mb-4 text-primary" />
        <h1 className="text-4xl font-headline font-bold">Community & Well-being Hub</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Connect, share, and find support in a safe and anonymous space.
        </p>
      </div>

      <Tabs defaultValue="forum" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forum">
            <MessageSquare className="mr-2 h-4 w-4" /> Discussion Forum
          </TabsTrigger>
          <TabsTrigger value="mood-support">
            <Heart className="mr-2 h-4 w-4" /> Mood Support Bot
          </TabsTrigger>
        </TabsList>
        <TabsContent value="forum">
          <Card>
            <CardHeader>
              <CardTitle>Anonymous Discussion Forum</CardTitle>
              <CardDescription>Share your thoughts. All posts are anonymous and moderated by AI for safety.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form action={postDispatch} ref={postFormRef} className="flex items-start gap-4">
                <Avatar>
                  {anonymousAvatar && <AvatarImage src={anonymousAvatar.imageUrl} alt="Anonymous user" data-ai-hint={anonymousAvatar.imageHint}/>}
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <Textarea
                        name="content"
                        placeholder="What's on your mind?"
                        className="w-full"
                        rows={3}
                    />
                    <div className="flex justify-end mt-2">
                         <PostSubmitButton />
                    </div>
                </div>
              </form>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4">
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <div key={index} className="flex gap-4">
                      <Avatar>
                        <Image src={post.avatar} width={40} height={40} alt={post.author} className="rounded-full" data-ai-hint="person face" />
                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 rounded-lg bg-muted p-3">
                        <p className="text-sm">{post.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <p>No posts yet. Be the first to start a conversation!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mood-support">
          <Card>
            <CardHeader>
              <CardTitle>Mood Support Bot</CardTitle>
              <CardDescription>Feeling down? Share how you feel and get some positive encouragement from our AI bot.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <form action={motivationDispatch} ref={motivationFormRef} className="space-y-4">
                            <Textarea
                            name="message"
                            placeholder="Tell me what's going on..."
                            rows={5}
                            />
                            <MotivationSubmitButton />
                        </form>
                    </div>
                    <div className="bg-muted rounded-lg p-6 flex flex-col justify-center">
                        {motivationState?.data ? (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-primary">A message for you:</h4>
                                    <p className="italic">"{motivationState.data.motivationalMessage}"</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-primary">A small step you can take:</h4>
                                    <p>{motivationState.data.suggestedAction}</p>
                                </div>
                                 <div>
                                    <h4 className="font-semibold text-primary">Need to talk to someone?</h4>
                                    <p className="text-sm">{motivationState.data.counselorConnectionMessage}</p>
                                    <Button asChild size="sm" className="mt-2">
                                      <Link href="https://www.nami.org/Home" target="_blank" rel="noopener noreferrer">
                                        Connect to a Counselor
                                      </Link>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <Heart className="mx-auto h-12 w-12 opacity-20" />
                                <p className="mt-2">Your words of encouragement will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
