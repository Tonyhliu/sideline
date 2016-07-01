class Comment < ActiveRecord::Base
  validates :body, presence: true

  belongs_to :story
  inverse_of: :comment,
  dependent: :destroy
end